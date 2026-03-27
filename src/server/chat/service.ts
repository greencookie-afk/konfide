import "server-only";
import type { SessionStatus, UserRole } from "@/generated/prisma";
import { decryptChatBodyForDisplay, encryptChatBody, isEncryptedChatBody } from "@/server/chat/encryption";
import { prisma } from "@/server/db/client";
import { isSessionRequestPending } from "@/server/sessions/service";

export type SessionChatMessageView = {
  id: string;
  body: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: UserRole;
  };
};

export type SessionChatState = {
  messages: SessionChatMessageView[];
  canSend: boolean;
  accessMessage: string;
};

function mapMessage(message: {
  id: string;
  body: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
}): SessionChatMessageView {
  return {
    id: message.id,
    body: decryptChatBodyForDisplay(message.body),
    createdAt: message.createdAt,
    sender: {
      id: message.sender.id,
      name: message.sender.name ?? "Konfide member",
      avatarUrl: message.sender.avatarUrl,
      role: message.sender.role,
    },
  };
}

async function migrateLegacySessionMessages(messages: Array<{ id: string; body: string }>) {
  const legacyMessages = messages.filter((message) => !isEncryptedChatBody(message.body));

  if (!legacyMessages.length) {
    return;
  }

  await prisma.$transaction(
    legacyMessages.map((message) =>
      prisma.sessionChatMessage.update({
        where: {
          id: message.id,
        },
        data: {
          body: encryptChatBody(message.body),
        },
      })
    )
  );
}

async function getParticipantSession(sessionId: string, userId: string) {
  return prisma.sessionBooking.findFirst({
    where: {
      id: sessionId,
      OR: [{ talkerId: userId }, { listenerId: userId }],
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

function getChatAccessState(input: {
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  status: SessionStatus;
}) {
  if (isSessionRequestPending({ paymentStatus: input.paymentStatus })) {
    return {
      canSend: false,
      accessMessage: "This chat opens as soon as the listener accepts your request.",
    };
  }

  if (input.paymentStatus === "PAID" && input.status === "CONFIRMED") {
    return {
      canSend: true,
      accessMessage: "The chat is open and its history stays here permanently.",
    };
  }

  if (input.paymentStatus === "FAILED") {
    return {
      canSend: false,
      accessMessage: "This request was declined, so the chat is read-only now.",
    };
  }

  return {
    canSend: false,
    accessMessage: "This chat is closed.",
  };
}

export async function getSessionChatStateForUser(sessionId: string, userId: string): Promise<SessionChatState | null> {
  const session = await getParticipantSession(sessionId, userId);

  if (!session) {
    return null;
  }

  const access = getChatAccessState({
    paymentStatus: session.paymentStatus,
    status: session.status,
  });

  await migrateLegacySessionMessages(session.messages);

  return {
    messages: session.messages.map(mapMessage),
    canSend: access.canSend,
    accessMessage: access.accessMessage,
  };
}

export async function createSessionChatMessage(input: { sessionId: string; userId: string; body: string }) {
  const body = input.body.trim();

  if (!body) {
    throw new Error("Write a message before sending.");
  }

  if (body.length > 2000) {
    throw new Error("Keep chat messages under 2000 characters.");
  }

  const session = await getParticipantSession(input.sessionId, input.userId);

  if (!session) {
    throw new Error("That session was not found.");
  }

  const access = getChatAccessState({
    paymentStatus: session.paymentStatus,
    status: session.status,
  });

  if (!access.canSend) {
    throw new Error(access.accessMessage);
  }

  const message = await prisma.sessionChatMessage.create({
    data: {
      sessionId: session.id,
      senderId: input.userId,
      body: encryptChatBody(body),
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  });

  return {
    message: mapMessage(message),
    accessMessage: access.accessMessage,
  };
}
