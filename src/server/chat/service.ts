import "server-only";
import type { SessionStatus, UserRole } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import { getSessionTimingSnapshot, isSessionRequestPending } from "@/server/sessions/service";

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
    body: message.body,
    createdAt: message.createdAt,
    sender: {
      id: message.sender.id,
      name: message.sender.name ?? "Konfide member",
      avatarUrl: message.sender.avatarUrl,
      role: message.sender.role,
    },
  };
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

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function getChatAccessState(input: {
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  scheduledAt: Date;
  durationMinutes: number;
  status: SessionStatus;
}) {
  if (isSessionRequestPending({ paymentStatus: input.paymentStatus })) {
    return {
      canSend: false,
      accessMessage: "This chat opens as soon as the listener accepts your request.",
    };
  }

  const timing = getSessionTimingSnapshot({
    scheduledAt: input.scheduledAt,
    durationMinutes: input.durationMinutes,
    status: input.status,
    paymentStatus: input.paymentStatus,
  });

  if (timing.isJoinWindowOpen) {
    return {
      canSend: true,
      accessMessage: "The chat is live now.",
    };
  }

  if (timing.isUpcoming) {
    return {
      canSend: false,
      accessMessage: `This chat opens at ${formatTime(timing.opensAt)}.`,
    };
  }

  return {
    canSend: false,
    accessMessage: "This chat is closed because the conversation window has ended.",
  };
}

export async function getSessionChatStateForUser(sessionId: string, userId: string): Promise<SessionChatState | null> {
  const session = await getParticipantSession(sessionId, userId);

  if (!session) {
    return null;
  }

  const access = getChatAccessState({
    paymentStatus: session.paymentStatus,
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    status: session.status,
  });

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
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    status: session.status,
  });

  if (!access.canSend) {
    throw new Error(access.accessMessage);
  }

  const message = await prisma.sessionChatMessage.create({
    data: {
      sessionId: session.id,
      senderId: input.userId,
      body,
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
