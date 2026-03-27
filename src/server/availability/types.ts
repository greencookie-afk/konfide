export type ListenerSettingsSnapshot = {
  timezone: string;
  defaultSessionMinutes: number;
  bufferMinutes: number;
  acceptingNewBookings: boolean;
  lastActiveAt: Date | null;
};

export type AvailabilityEditorData = {
  acceptingNewBookings: boolean;
  isPublished: boolean;
  lastActiveAt: Date | null;
  isListedInExplore: boolean;
  isActiveNow: boolean;
  awayTimeoutMinutes: number;
};
