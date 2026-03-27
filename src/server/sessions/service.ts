import "server-only";
import type { Prisma, SessionPaymentStatus, SessionStatus } from "@/generated/prisma";
import { prisma } from "@/server/db/client";

const MAX_PENDING_REQUESTS_PER_LISTENER = 5;

export type ConversationState = "PENDING" | "OPEN" | "DECLINED" | "CLOSED";

export type SessionCard = {
  id: string;
  counterpartyName: string;
  counterpartyAvatarUrl: string | null;
  headline: string;
  requestedAt: Date;
  openedAt: Date | null;
  requestState: ConversationState;
  topic: string | null;
};

export type SessionDetail = {
  id: string;
  requestedAt: Date;
  openedAt: Date | null;
  requestState: ConversationState;
  topic: string | null;
  notes: string | null;
  talker: {
    id: string;
    name: string;
    avatarUrl: string | null;
    email: string;
  };
  listener: {
    id: string;
    name: string;
    avatarUrl: string | null;
    headline: string;
    slug: string | null;
  };
};

type SessionDetailRecord = Prisma.SessionBookingGetPayload<{
  include: {
    talker: {
      select: {
        id: true;
        name: true;
        avatarUrl: true;
        email: true;
      };
    };
    listener: {
      select: {
        id: true;
        name: true;
        avatarUrl: true;
        listenerProfile: {
          select: {
            headline: true;
            slug: true;
          };
        };
      };
    };
  };
}>;

export function getConversationState(input: {
  paymentStatus: SessionPaymentStatus;
  status: SessionStatus;
}): ConversationState {
  if (input.paymentStatus === "FAILED") {
    return "DECLINED";
  }

  if (input.paymentStatus === "REFUNDED" || input.status !== "CONFIRMED") {
    return "CLOSED";
  }

  if (input.paymentStatus === "PAID") {
    return "OPEN";
  }

  return "PENDING";
}

export function getConversationStateLabel(state: ConversationState) {
  if (state === "OPEN") {
    return "Open";
  }

  if (state === "DECLINED") {
    return "Declined";
  }

  if (state === "CLOSED") {
    return "Closed";
  }

  return "Pending";
}

function mapSessionDetail(session: SessionDetailRecord): SessionDetail {
  return {
    id: session.id,
    requestedAt: session.createdAt,
    openedAt: session.paidAt,
    requestState: getConversationState(session),
    topic: session.topic,
    notes: session.notes,
    talker: {
      id: session.talker.id,
      name: session.talker.name ?? "Konfide member",
      avatarUrl: session.talker.avatarUrl,
      email: session.talker.email,
    },
    listener: {
      id: session.listener.id,
      name: session.listener.name ?? "Listener",
      avatarUrl: session.listener.avatarUrl,
      headline: session.listener.listenerProfile?.headline ?? "Listener session",
      slug: session.listener.listenerProfile?.slug ?? null,
    },
  };
}

export function isConversationPending(input: Pick<SessionDetail | SessionCard, "requestState">) {
  return input.requestState === "PENDING";
}

export function isConversationOpen(input: Pick<SessionDetail | SessionCard, "requestState">) {
  return input.requestState === "OPEN";
}

export async function createConversationRequest(input: {
  talkerId: string;
  listenerSlug: string;
  topic?: string;
  notes?: string;
}) {
  const topic = input.topic?.trim() || null;
  const notes = input.notes?.trim() || null;

  if (topic && topic.length > 120) {
    throw new Error("Keep the topic under 120 characters.");
  }

  if (notes && notes.length > 2000) {
    throw new Error("Keep the context under 2000 characters.");
  }

  const listener = await prisma.listenerProfile.findFirst({
    where: {
      slug: input.listenerSlug,
      isPublished: true,
      user: {
        is: {
          role: "LISTENER",
          listenerSettings: {
            is: {
              acceptingNewBookings: true,
            },
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!listener) {
    throw new Error("This listener has requests turned off right now.");
  }

  if (listener.user.id === input.talkerId) {
    throw new Error("You cannot start a chat with your own listener account.");
  }

  const existingPendingRequest = await prisma.sessionBooking.findFirst({
    where: {
      talkerId: input.talkerId,
      listenerId: listener.user.id,
      status: "CONFIRMED",
      paymentStatus: {
        in: ["UNPAID", "PENDING"],
      },
    },
    select: {
      id: true,
    },
  });

  if (existingPendingRequest) {
    throw new Error("You already have a request waiting for this listener.");
  }

  const pendingRequestCount = await prisma.sessionBooking.count({
    where: {
      listenerId: listener.user.id,
      status: "CONFIRMED",
      paymentStatus: {
        in: ["UNPAID", "PENDING"],
      },
    },
  });

  if (pendingRequestCount >= MAX_PENDING_REQUESTS_PER_LISTENER) {
    throw new Error(
      "This listener already has the maximum number of pending requests right now. Try again after they accept one."
    );
  }

  return prisma.sessionBooking.create({
    data: {
      talkerId: input.talkerId,
      listenerId: listener.user.id,
      scheduledAt: new Date(),
      durationMinutes: 0,
      topic,
      notes,
      ratePerMinuteCents: 0,
      totalAmountCents: 0,
      status: "CONFIRMED",
      paymentStatus: "PENDING",
    },
  });
}

export async function acceptConversationRequest(listenerId: string, sessionId: string) {
  const session = await prisma.sessionBooking.findFirst({
    where: {
      id: sessionId,
      listenerId,
    },
    select: {
      id: true,
      paymentStatus: true,
    },
  });

  if (!session) {
    throw new Error("That request was not found.");
  }

  if (session.paymentStatus === "PAID") {
    return session;
  }

  const openedAt = new Date();

  return prisma.sessionBooking.update({
    where: {
      id: sessionId,
    },
    data: {
      paymentStatus: "PAID",
      paidAt: openedAt,
      scheduledAt: openedAt,
    },
    select: {
      id: true,
      paymentStatus: true,
    },
  });
}

export async function getTalkerSessions(talkerId: string): Promise<SessionCard[]> {
  const sessions = await prisma.sessionBooking.findMany({
    where: {
      talkerId,
    },
    include: {
      listener: {
        select: {
          name: true,
          avatarUrl: true,
          listenerProfile: {
            select: {
              headline: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    counterpartyName: session.listener.name ?? "Listener",
    counterpartyAvatarUrl: session.listener.avatarUrl,
    headline: session.listener.listenerProfile?.headline ?? "Listener session",
    requestedAt: session.createdAt,
    openedAt: session.paidAt,
    requestState: getConversationState(session),
    topic: session.topic,
  }));
}

export async function getListenerSessions(listenerId: string): Promise<SessionCard[]> {
  const sessions = await prisma.sessionBooking.findMany({
    where: {
      listenerId,
    },
    include: {
      talker: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
      listener: {
        select: {
          listenerProfile: {
            select: {
              headline: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    counterpartyName: session.talker.name ?? "Konfide member",
    counterpartyAvatarUrl: session.talker.avatarUrl,
    headline: session.listener.listenerProfile?.headline ?? "Listener session",
    requestedAt: session.createdAt,
    openedAt: session.paidAt,
    requestState: getConversationState(session),
    topic: session.topic,
  }));
}

export async function getTalkerSessionDetail(talkerId: string, sessionId: string): Promise<SessionDetail | null> {
  const session = await prisma.sessionBooking.findFirst({
    where: {
      id: sessionId,
      talkerId,
    },
    include: {
      talker: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      listener: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          listenerProfile: {
            select: {
              headline: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return session ? mapSessionDetail(session) : null;
}

export async function getListenerSessionDetail(listenerId: string, sessionId: string): Promise<SessionDetail | null> {
  const session = await prisma.sessionBooking.findFirst({
    where: {
      id: sessionId,
      listenerId,
    },
    include: {
      talker: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      listener: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          listenerProfile: {
            select: {
              headline: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return session ? mapSessionDetail(session) : null;
}

export async function getListenerDashboardData(listenerId: string) {
  const [profileData, settings, sessions] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: listenerId,
      },
      select: {
        name: true,
        avatarUrl: true,
        listenerProfile: true,
      },
    }),
    prisma.listenerSettings.findUnique({
      where: {
        userId: listenerId,
      },
      select: {
        acceptingNewBookings: true,
        lastActiveAt: true,
      },
    }),
    prisma.sessionBooking.findMany({
      where: {
        listenerId,
      },
      include: {
        talker: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const conversations = sessions.map((session) => ({
    id: session.id,
    talkerName: session.talker.name ?? "Konfide member",
    topic: session.topic,
    requestedAt: session.createdAt,
    openedAt: session.paidAt,
    requestState: getConversationState(session),
  }));
  const pendingRequests = conversations.filter((conversation) => isConversationPending(conversation));
  const openConversations = conversations.filter((conversation) => isConversationOpen(conversation));

  return {
    name: profileData?.name ?? "Listener",
    avatarUrl: profileData?.avatarUrl ?? null,
    profile: profileData?.listenerProfile ?? null,
    settings,
    pendingRequestsCount: pendingRequests.length,
    openConversationsCount: openConversations.length,
    totalConnectionsCount: openConversations.length,
    pendingRequests: pendingRequests.slice(0, 4),
    openConversations: openConversations.slice(0, 3),
  };
}
