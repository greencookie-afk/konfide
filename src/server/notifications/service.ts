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
        ? `Chat started ${formatDateTime(session.scheduledAt)}`
        : `Request sent ${formatDateTime(session.createdAt)}`,
    href: `/sessions/${session.id}`,
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
  const profileReady = Boolean(profile?.slug && profile.headline && profile.about && profile.specialties.length);

  if (!profileReady || !profile?.isPublished) {
    notifications.push({
      id: "listener-profile",
      title: "Finish your public profile",
      description: "Add your headline, about section, specialties, and publish the listing when ready.",
      href: "/listener/profile",
      timestamp: null,
      tone: "action",
    });
  }

  if (!settings?.acceptingNewBookings) {
    notifications.push({
      id: "listener-availability",
      title: "You are hidden from browse",
      description: "Turn on your availability button when you are ready to accept live chat requests.",
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
      href: `/listener/sessions/${session.id}`,
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
