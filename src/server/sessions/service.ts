import "server-only";
import type { SessionStatus } from "@/generated/prisma";
import { SESSION_DURATION_OPTIONS } from "@/server/availability/types";
import { prisma } from "@/server/db/client";
import { getBookableCalendarForListener } from "@/server/availability/service";

export type SessionCard = {
  id: string;
  counterpartyName: string;
  counterpartyAvatarUrl: string | null;
  headline: string;
  scheduledAt: Date;
  durationMinutes: number;
  totalAmountCents: number;
  status: SessionStatus;
  topic: string | null;
};

function isBookableTime(iso: string, calendar: Awaited<ReturnType<typeof getBookableCalendarForListener>>) {
  return calendar.dates.some((date) => date.times.some((time) => time.iso === iso));
}

export async function createSessionBooking(input: {
  talkerId: string;
  listenerSlug: string;
  scheduledAtIso: string;
  durationMinutes: number;
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

  if (!listener || !listener.user.listenerSettings || !listener.ratePerMinuteCents) {
    throw new Error("This listener is not ready to accept bookings yet.");
  }

  if (listener.user.id === input.talkerId) {
    throw new Error("You cannot book a session with your own listener account.");
  }

  const scheduledAt = new Date(input.scheduledAtIso);

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error("Choose a valid booking time.");
  }

  if (scheduledAt <= new Date()) {
    throw new Error("Choose a future booking time.");
  }

  if (!SESSION_DURATION_OPTIONS.includes(input.durationMinutes as (typeof SESSION_DURATION_OPTIONS)[number])) {
    throw new Error("Choose a supported session duration.");
  }

  const calendar = await getBookableCalendarForListener(listener.user.id, input.durationMinutes);

  if (!isBookableTime(scheduledAt.toISOString(), calendar)) {
    throw new Error("That booking time is no longer available.");
  }

  return prisma.sessionBooking.create({
    data: {
      talkerId: input.talkerId,
      listenerId: listener.user.id,
      scheduledAt,
      durationMinutes: input.durationMinutes,
      topic: input.topic?.trim() || null,
      notes: input.notes?.trim() || null,
      ratePerMinuteCents: listener.ratePerMinuteCents,
      totalAmountCents: listener.ratePerMinuteCents * input.durationMinutes,
      status: "CONFIRMED",
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
      scheduledAt: "asc",
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    counterpartyName: session.listener.name ?? "Listener",
    counterpartyAvatarUrl: session.listener.avatarUrl,
    headline: session.listener.listenerProfile?.headline ?? "Listener session",
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    totalAmountCents: session.totalAmountCents,
    status: session.status,
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
      scheduledAt: "asc",
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    counterpartyName: session.talker.name ?? "Konfide member",
    counterpartyAvatarUrl: session.talker.avatarUrl,
    headline: session.listener.listenerProfile?.headline ?? "Listener session",
    scheduledAt: session.scheduledAt,
    durationMinutes: session.durationMinutes,
    totalAmountCents: session.totalAmountCents,
    status: session.status,
    topic: session.topic,
  }));
}

export async function getListenerDashboardData(listenerId: string) {
  const [profileData, settings, slots, sessions] = await Promise.all([
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
    prisma.listenerAvailabilitySlot.findMany({
      where: {
        listenerId,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }],
    }),
    prisma.sessionBooking.findMany({
      where: {
        listenerId,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    }),
  ]);

  const completedSessions = sessions.filter((session) => session.status === "COMPLETED");
  const upcomingSessions = sessions.filter((session) => session.status === "CONFIRMED" && session.scheduledAt >= new Date());
  const profileFields = [
    Boolean(profileData?.name),
    Boolean(profileData?.avatarUrl),
    Boolean(profileData?.listenerProfile?.slug),
    Boolean(profileData?.listenerProfile?.headline),
    Boolean(profileData?.listenerProfile?.about),
    Boolean(profileData?.listenerProfile?.ratePerMinuteCents),
    Boolean(profileData?.listenerProfile?.specialties.length),
    Boolean(slots.length),
  ];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const availabilityDays = new Set(slots.map((slot) => slot.dayOfWeek)).size;

  return {
    name: profileData?.name ?? "Listener",
    avatarUrl: profileData?.avatarUrl ?? null,
    profile: profileData?.listenerProfile ?? null,
    settings,
    availabilityDays,
    totalEarningsCents: completedSessions.reduce((sum, session) => sum + session.totalAmountCents, 0),
    completedSessionsCount: completedSessions.length,
    upcomingSessionsCount: upcomingSessions.length,
    upcomingSessions: upcomingSessions.slice(0, 3),
    recentCompletedSessions: completedSessions.slice(-3).reverse(),
    profileCompletion,
  };
}
