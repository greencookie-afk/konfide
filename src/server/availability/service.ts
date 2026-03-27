import "server-only";
import type { ListenerSettings } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import type { AvailabilityEditorData, ListenerSettingsSnapshot } from "@/server/availability/types";

const DEFAULT_TIMEZONE = "Asia/Kolkata";
const DEFAULT_SESSION_MINUTES = 45;
const DEFAULT_BUFFER_MINUTES = 15;

function mapSettings(settings: ListenerSettings | null | undefined): ListenerSettingsSnapshot {
  return {
    timezone: settings?.timezone ?? DEFAULT_TIMEZONE,
    defaultSessionMinutes: settings?.defaultSessionMinutes ?? DEFAULT_SESSION_MINUTES,
    bufferMinutes: settings?.bufferMinutes ?? DEFAULT_BUFFER_MINUTES,
    acceptingNewBookings: settings?.acceptingNewBookings ?? false,
  };
}

export function getDefaultListenerSettings(): ListenerSettingsSnapshot {
  return mapSettings(null);
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
    },
    update: {
      acceptingNewBookings: Boolean(input.acceptingNewBookings),
    },
  });
}
