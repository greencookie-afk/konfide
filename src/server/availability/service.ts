import "server-only";
import type { ListenerAvailabilitySlot, ListenerSettings, SessionBooking } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import {
  BUFFER_OPTIONS,
  SESSION_DURATION_OPTIONS,
  WEEK_DAYS,
  type AvailabilityDay,
  type AvailabilityEditorData,
  type AvailabilitySlotInput,
  type BookableCalendar,
  type ListenerSettingsSnapshot,
} from "@/server/availability/types";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMinutes(date: Date, amount: number) {
  return new Date(date.getTime() + amount * 60_000);
}

function minuteToLabel(minute: number) {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  const date = new Date(2000, 0, 1, hours, minutes);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function buildDateForMinute(date: Date, minute: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(minute / 60), minute % 60, 0, 0);
}

function normalizeSlots(slots: AvailabilitySlotInput[]) {
  return slots
    .filter((slot) => Number.isInteger(slot.dayOfWeek) && Number.isInteger(slot.startMinute) && Number.isInteger(slot.endMinute))
    .map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      startMinute: slot.startMinute,
      endMinute: slot.endMinute,
    }))
    .sort((left, right) => left.dayOfWeek - right.dayOfWeek || left.startMinute - right.startMinute);
}

function validateSlots(slots: AvailabilitySlotInput[]) {
  const normalizedSlots = normalizeSlots(slots);

  for (const slot of normalizedSlots) {
    if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
      throw new Error("Availability day is invalid.");
    }

    if (slot.startMinute < 0 || slot.startMinute >= 24 * 60 || slot.endMinute < 1 || slot.endMinute > 24 * 60) {
      throw new Error("Availability time is out of range.");
    }

    if (slot.startMinute >= slot.endMinute) {
      throw new Error("Each availability block must end after it starts.");
    }

    if (slot.startMinute % 15 !== 0 || slot.endMinute % 15 !== 0) {
      throw new Error("Availability blocks must use 15 minute increments.");
    }
  }

  for (const day of WEEK_DAYS) {
    const daySlots = normalizedSlots.filter((slot) => slot.dayOfWeek === day.dayOfWeek);

    for (let index = 1; index < daySlots.length; index += 1) {
      if (daySlots[index - 1].endMinute > daySlots[index].startMinute) {
        throw new Error(`Availability blocks overlap on ${day.longLabel}.`);
      }
    }
  }

  return normalizedSlots;
}

function buildAvailabilityDays(slots: AvailabilitySlotInput[]): AvailabilityDay[] {
  return WEEK_DAYS.map((day) => ({
    dayOfWeek: day.dayOfWeek,
    shortLabel: day.shortLabel,
    longLabel: day.longLabel,
    slots: slots
      .filter((slot) => slot.dayOfWeek === day.dayOfWeek)
      .sort((left, right) => left.startMinute - right.startMinute),
  }));
}

function formatBookableDate(date: Date) {
  return {
    shortLabel: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
    monthLabel: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    dayNumber: String(date.getDate()),
  };
}

function isCandidateAvailable(
  candidateStart: Date,
  candidateEnd: Date,
  existingBookings: SessionBooking[],
  bufferMinutes: number
) {
  return existingBookings.every((booking) => {
    const bookingStart = booking.scheduledAt;
    const bookingEnd = addMinutes(booking.scheduledAt, booking.durationMinutes);

    return (
      candidateStart >= addMinutes(bookingEnd, bufferMinutes) ||
      addMinutes(candidateEnd, bufferMinutes) <= bookingStart
    );
  });
}

export function getDefaultListenerSettings(): ListenerSettingsSnapshot {
  return {
    timezone: DEFAULT_TIMEZONE,
    defaultSessionMinutes: 45,
    bufferMinutes: 15,
    acceptingNewBookings: true,
  };
}

function mapSettings(settings: ListenerSettings | null | undefined): ListenerSettingsSnapshot {
  return {
    timezone: settings?.timezone ?? DEFAULT_TIMEZONE,
    defaultSessionMinutes: settings?.defaultSessionMinutes ?? 45,
    bufferMinutes: settings?.bufferMinutes ?? 15,
    acceptingNewBookings: settings?.acceptingNewBookings ?? true,
  };
}

export async function getListenerAvailabilityEditor(userId: string): Promise<AvailabilityEditorData> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      listenerSettings: true,
      listenerAvailabilitySlots: {
        select: {
          id: true,
          dayOfWeek: true,
          startMinute: true,
          endMinute: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }],
      },
    },
  });

  return {
    settings: mapSettings(user?.listenerSettings),
    days: buildAvailabilityDays(user?.listenerAvailabilitySlots ?? []),
  };
}

export async function replaceListenerAvailability(
  userId: string,
  input: {
    timezone?: string;
    defaultSessionMinutes?: number;
    bufferMinutes?: number;
    acceptingNewBookings?: boolean;
    slots?: AvailabilitySlotInput[];
  }
) {
  const defaultSessionMinutes = Number(input.defaultSessionMinutes ?? 45);
  const bufferMinutes = Number(input.bufferMinutes ?? 15);

  if (!SESSION_DURATION_OPTIONS.includes(defaultSessionMinutes as (typeof SESSION_DURATION_OPTIONS)[number])) {
    throw new Error("Choose a supported default session length.");
  }

  if (!BUFFER_OPTIONS.includes(bufferMinutes as (typeof BUFFER_OPTIONS)[number])) {
    throw new Error("Choose a supported buffer time.");
  }

  const normalizedSlots = validateSlots(input.slots ?? []);

  await prisma.$transaction([
    prisma.listenerSettings.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        timezone: input.timezone?.trim() || DEFAULT_TIMEZONE,
        defaultSessionMinutes,
        bufferMinutes,
        acceptingNewBookings: input.acceptingNewBookings ?? true,
      },
      update: {
        timezone: input.timezone?.trim() || DEFAULT_TIMEZONE,
        defaultSessionMinutes,
        bufferMinutes,
        acceptingNewBookings: input.acceptingNewBookings ?? true,
      },
    }),
    prisma.listenerAvailabilitySlot.deleteMany({
      where: {
        listenerId: userId,
      },
    }),
    prisma.listenerAvailabilitySlot.createMany({
      data: normalizedSlots.map((slot) => ({
        listenerId: userId,
        dayOfWeek: slot.dayOfWeek,
        startMinute: slot.startMinute,
        endMinute: slot.endMinute,
      })),
    }),
  ]);
}

export async function getListenerAvailabilitySource(userId: string) {
  const today = startOfDay(new Date());
  const horizonEnd = addDays(today, 8);
  const [settings, slots, bookings] = await Promise.all([
    prisma.listenerSettings.findUnique({
      where: {
        userId,
      },
    }),
    prisma.listenerAvailabilitySlot.findMany({
      where: {
        listenerId: userId,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }],
    }),
    prisma.sessionBooking.findMany({
      where: {
        listenerId: userId,
        status: "CONFIRMED",
        scheduledAt: {
          gte: today,
          lt: horizonEnd,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    }),
  ]);

  return {
    settings: mapSettings(settings),
    slots,
    bookings,
  };
}

export function buildBookableCalendarFromSource(
  source: {
    settings: ListenerSettingsSnapshot;
    slots: Pick<ListenerAvailabilitySlot, "dayOfWeek" | "startMinute" | "endMinute">[];
    bookings: Pick<SessionBooking, "scheduledAt" | "durationMinutes">[];
  },
  durationMinutes: number
): BookableCalendar {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 7 }, (_, index) => addDays(today, index)).map((date) => {
    const matchingSlots = source.slots.filter((slot) => slot.dayOfWeek === date.getDay());
    const dateBookings = source.bookings.filter(
      (booking) => booking.scheduledAt.toDateString() === date.toDateString()
    );
    const times = matchingSlots.flatMap((slot) => {
      const nextTimes = [];

      for (let minute = slot.startMinute; minute + durationMinutes <= slot.endMinute; minute += 15) {
        const candidateStart = buildDateForMinute(date, minute);
        const candidateEnd = addMinutes(candidateStart, durationMinutes);

        if (isCandidateAvailable(candidateStart, candidateEnd, dateBookings as SessionBooking[], source.settings.bufferMinutes)) {
          nextTimes.push({
            iso: candidateStart.toISOString(),
            label: minuteToLabel(minute),
          });
        }
      }

      return nextTimes;
    });
    const labels = formatBookableDate(date);

    return {
      isoDate: date.toISOString().slice(0, 10),
      shortLabel: labels.shortLabel,
      monthLabel: labels.monthLabel,
      dayNumber: labels.dayNumber,
      isToday: indexOfSameDay(date, today),
      times,
    };
  });

  return {
    dates,
    nextAvailableAt: dates.flatMap((date) => date.times)[0]?.iso ?? null,
  };
}

function indexOfSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

export async function getBookableCalendarForListener(userId: string, durationMinutes: number) {
  const source = await getListenerAvailabilitySource(userId);
  return buildBookableCalendarFromSource(source, durationMinutes);
}

export function formatMinuteRange(startMinute: number, endMinute: number) {
  return `${minuteToLabel(startMinute)} - ${minuteToLabel(endMinute)}`;
}
