import "server-only";
import type { Prisma, SessionPaymentStatus, SessionStatus } from "@/generated/prisma";
import { getDefaultListenerSettings } from "@/server/availability/service";
import { prisma } from "@/server/db/client";

const MAX_PENDING_REQUESTS_PER_LISTENER = 5;

export type SessionCard = {
  id: string;
  counterpartyName: string;
  counterpartyAvatarUrl: string | null;
  headline: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: SessionStatus;
  paymentStatus: SessionPaymentStatus;
  topic: string | null;
  createdAt: Date;
  acceptedAt: Date | null;
};

export type SessionDetail = {
  id: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: SessionStatus;
  paymentStatus: SessionPaymentStatus;
  createdAt: Date;
  acceptedAt: Date | null;
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

function mapSessionDetail(session: SessionDetailRecord): SessionDetail {
  return {
    id: session.id,
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    status: session.status,
    paymentStatus: session.paymentStatus,
    createdAt: session.createdAt,
    acceptedAt: session.paidAt,
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

export function getSessionConnectionLabel(paymentStatus: SessionPaymentStatus) {
  if (paymentStatus === "PAID") {
    return "Open";
  }

  if (paymentStatus === "FAILED") {
    return "Declined";
  }

  if (paymentStatus === "REFUNDED") {
    return "Closed";
  }

  return "Pending";
}

export function isSessionRequestPending(input: Pick<SessionDetail | SessionCard, "paymentStatus">) {
  return input.paymentStatus === "UNPAID" || input.paymentStatus === "PENDING";
}

export function isSessionLive(
  session: Pick<SessionDetail | SessionCard, "scheduledAt" | "durationMinutes" | "status" | "paymentStatus">
) {
  return session.paymentStatus === "PAID" && session.status === "CONFIRMED";
}

export async function createConversationRequest(input: {
  talkerId: string;
  listenerSlug: string;
  topic?: string;
  notes?: string;
}) {
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
          listenerSettings: true,
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

  const settings = listener.user.listenerSettings ?? getDefaultListenerSettings();

  return prisma.sessionBooking.create({
    data: {
      talkerId: input.talkerId,
      listenerId: listener.user.id,
      scheduledAt: new Date(),
      durationMinutes: settings.defaultSessionMinutes,
      topic: input.topic?.trim() || null,
      notes: input.notes?.trim() || null,
      ratePerMinuteCents: listener.ratePerMinuteCents ?? 0,
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

  const acceptedAt = new Date();

  return prisma.sessionBooking.update({
    where: {
      id: sessionId,
    },
    data: {
      paymentStatus: "PAID",
      paidAt: acceptedAt,
      scheduledAt: acceptedAt,
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
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    status: session.status,
    paymentStatus: session.paymentStatus,
    topic: session.topic,
    createdAt: session.createdAt,
    acceptedAt: session.paidAt,
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
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    status: session.status,
    paymentStatus: session.paymentStatus,
    topic: session.topic,
    createdAt: session.createdAt,
    acceptedAt: session.paidAt,
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

  const pendingRequests = sessions.filter((session) => isSessionRequestPending(session));
  const activeSessions = sessions.filter((session) => isSessionLive(session));
  const recentSessions = sessions.filter((session) => session.paymentStatus === "PAID").slice(0, 3);

  return {
    name: profileData?.name ?? "Listener",
    avatarUrl: profileData?.avatarUrl ?? null,
    profile: profileData?.listenerProfile ?? null,
    settings,
    pendingRequestsCount: pendingRequests.length,
    activeSessionsCount: activeSessions.length,
    totalConnectionsCount: sessions.filter((session) => session.paymentStatus === "PAID").length,
    pendingRequests: pendingRequests.slice(0, 4),
    activeSessions: activeSessions.slice(0, 3),
    recentSessions,
  };
}
