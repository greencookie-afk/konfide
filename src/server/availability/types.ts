export const WEEK_DAYS = [
  { dayOfWeek: 1, shortLabel: "Mon", longLabel: "Monday" },
  { dayOfWeek: 2, shortLabel: "Tue", longLabel: "Tuesday" },
  { dayOfWeek: 3, shortLabel: "Wed", longLabel: "Wednesday" },
  { dayOfWeek: 4, shortLabel: "Thu", longLabel: "Thursday" },
  { dayOfWeek: 5, shortLabel: "Fri", longLabel: "Friday" },
  { dayOfWeek: 6, shortLabel: "Sat", longLabel: "Saturday" },
  { dayOfWeek: 0, shortLabel: "Sun", longLabel: "Sunday" },
] as const;

export const SESSION_DURATION_OPTIONS = [15, 30, 45, 60] as const;

export const BUFFER_OPTIONS = [0, 15, 30, 45, 60] as const;

export type AvailabilitySlotInput = {
  id?: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
};

export type AvailabilityDay = {
  dayOfWeek: number;
  shortLabel: string;
  longLabel: string;
  slots: AvailabilitySlotInput[];
};

export type ListenerSettingsSnapshot = {
  timezone: string;
  defaultSessionMinutes: number;
  bufferMinutes: number;
  acceptingNewBookings: boolean;
};

export type AvailabilityEditorData = {
  settings: ListenerSettingsSnapshot;
  days: AvailabilityDay[];
};

export type BookableTime = {
  iso: string;
  label: string;
};

export type BookableDate = {
  isoDate: string;
  shortLabel: string;
  monthLabel: string;
  dayNumber: string;
  isToday: boolean;
  times: BookableTime[];
};

export type BookableCalendar = {
  dates: BookableDate[];
  nextAvailableAt: string | null;
};
