import "server-only";
import type { ListenerSettings } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import type { AvailabilityEditorData, ListenerSettingsSnapshot } from "@/server/availability/types";

const DEFAULT_TIMEZONE = "Asia/Kolkata";
const DEFAULT_SESSION_MINUTES = 45;
const DEFAULT_BUFFER_MINUTES = 15;
export const LISTENER_AWAY_TIMEOUT_MINUTES = 5;
export const LISTENER_AWAY_TIMEOUT_MS = LISTENER_AWAY_TIMEOUT_MINUTES * 60_000;

function mapSettings(settings: ListenerSettings | null | undefined): ListenerSettingsSnapshot {
  return {
    timezone: settings?.timezone ?? DEFAULT_TIMEZONE,
    defaultSessionMinutes: settings?.defaultSessionMinutes ?? DEFAULT_SESSION_MINUTES,
    bufferMinutes: settings?.bufferMinutes ?? DEFAULT_BUFFER_MINUTES,
    acceptingNewBookings: settings?.acceptingNewBookings ?? false,
    lastActiveAt: settings?.lastActiveAt ?? null,
  };
}

export function getDefaultListenerSettings(): ListenerSettingsSnapshot {
  return mapSettings(null);
}

export function getListenerPresenceCutoff(now = new Date()) {
  return new Date(now.getTime() - LISTENER_AWAY_TIMEOUT_MS);
}

export function getVisibleListenerSettingsWhere(now = new Date()) {
  return {
    acceptingNewBookings: true,
    lastActiveAt: {
      gte: getListenerPresenceCutoff(now),
    },
  };
}

export function isListenerVisibleNow(input: {
  acceptingNewBookings: boolean;
  lastActiveAt: Date | null;
  isPublished?: boolean;
}) {
  return Boolean(
    input.acceptingNewBookings &&
      input.lastActiveAt &&
      input.lastActiveAt >= getListenerPresenceCutoff() &&
      input.isPublished !== false
  );
}

export async function getListenerAvailabilityEditor(userId: string): Promise<AvailabilityEditorData> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      listenerSettings: {
        select: {
          acceptingNewBookings: true,
          lastActiveAt: true,
        },
      },
      listenerProfile: {
        select: {
          isPublished: true,
        },
      },
    },
  });

  return {
    acceptingNewBookings: user?.listenerSettings?.acceptingNewBookings ?? false,
    isPublished: user?.listenerProfile?.isPublished ?? false,
    lastActiveAt: user?.listenerSettings?.lastActiveAt ?? null,
    isVisibleInBrowse: isListenerVisibleNow({
      acceptingNewBookings: user?.listenerSettings?.acceptingNewBookings ?? false,
      lastActiveAt: user?.listenerSettings?.lastActiveAt ?? null,
      isPublished: user?.listenerProfile?.isPublished ?? false,
    }),
    awayTimeoutMinutes: LISTENER_AWAY_TIMEOUT_MINUTES,
  };
}

export async function replaceListenerAvailability(
  userId: string,
  input: {
    acceptingNewBookings?: boolean;
  }
) {
  const existingSettings = await prisma.listenerSettings.findUnique({
    where: {
      userId,
    },
  });
  const snapshot = mapSettings(existingSettings);

  await prisma.listenerSettings.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      timezone: snapshot.timezone,
      defaultSessionMinutes: snapshot.defaultSessionMinutes,
      bufferMinutes: snapshot.bufferMinutes,
      acceptingNewBookings: Boolean(input.acceptingNewBookings),
      lastActiveAt: input.acceptingNewBookings ? new Date() : null,
    },
    update: {
      acceptingNewBookings: Boolean(input.acceptingNewBookings),
      lastActiveAt: input.acceptingNewBookings ? new Date() : null,
    },
  });
}

export async function touchListenerPresence(userId: string) {
  await prisma.listenerSettings.updateMany({
    where: {
      userId,
      acceptingNewBookings: true,
    },
    data: {
      lastActiveAt: new Date(),
    },
  });
}

export async function markListenerAway(userId: string) {
  await prisma.listenerSettings.updateMany({
    where: {
      userId,
    },
    data: {
      acceptingNewBookings: false,
      lastActiveAt: null,
    },
  });
}
