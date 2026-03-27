import "server-only";
import type { UserRole } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import { getSessionConnectionLabel } from "@/server/sessions/service";

export type NavbarNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  timestamp: string | null;
  tone: "session" | "action";
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

async function getTalkerNotifications(userId: string): Promise<NavbarNotification[]> {
  const sessions = await prisma.sessionBooking.findMany({
    where: {
      talkerId: userId,
      status: "CONFIRMED",
    },
    include: {
      listener: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return sessions.map((session) => ({
    id: session.id,
    title:
      session.paymentStatus === "PAID"
        ? `${session.listener.name ?? "Your listener"} accepted your request`
        : `Waiting on ${session.listener.name ?? "your listener"}`,
    description:
      session.paymentStatus === "PAID"
        ? `Chat opened ${formatDateTime(session.paidAt ?? session.scheduledAt)}`
        : `Request sent ${formatDateTime(session.createdAt)}`,
    href: `/sessions/${session.id}/chat`,
    timestamp: (session.paidAt ?? session.createdAt).toISOString(),
    tone: "session",
  }));
}

async function getListenerNotifications(userId: string): Promise<NavbarNotification[]> {
  const [profile, settings, pendingRequests] = await Promise.all([
    prisma.listenerProfile.findUnique({
      where: {
        userId,
      },
      select: {
        slug: true,
        headline: true,
        about: true,
        isPublished: true,
        specialties: true,
      },
    }),
    prisma.listenerSettings.findUnique({
      where: {
        userId,
      },
      select: {
        acceptingNewBookings: true,
      },
    }),
    prisma.sessionBooking.findMany({
      where: {
        listenerId: userId,
        status: "CONFIRMED",
        paymentStatus: {
          in: ["UNPAID", "PENDING"],
        },
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
      take: 3,
    }),
  ]);

  const notifications: NavbarNotification[] = [];
  if (!profile?.slug || !profile?.isPublished) {
    notifications.push({
      id: "listener-profile",
      title: "Update your public profile",
      description: "Save a public slug and publish the listing whenever you want to appear in explore.",
      href: "/listener/profile",
      timestamp: null,
      tone: "action",
    });
  }

  if (!settings?.acceptingNewBookings) {
    notifications.push({
      id: "listener-availability",
      title: "Requests are turned off",
      description: "Turn requests back on when you are ready to receive new chat requests.",
      href: "/listener/availability",
      timestamp: null,
      tone: "action",
    });
  }

  notifications.push(
    ...pendingRequests.map((session) => ({
      id: session.id,
      title: `New request from ${session.talker.name ?? "a Konfide member"}`,
      description: `${getSessionConnectionLabel(session.paymentStatus)} · ${formatDateTime(session.createdAt)}`,
      href: `/listener/sessions/${session.id}/chat`,
      timestamp: session.createdAt.toISOString(),
      tone: "session" as const,
    }))
  );

  return notifications.slice(0, 5);
}

export async function getNavbarNotifications(userId: string, role: UserRole): Promise<NavbarNotification[]> {
  if (role === "TALKER") {
    return getTalkerNotifications(userId);
  }

  if (role === "LISTENER") {
    return getListenerNotifications(userId);
  }

  return [];
}
