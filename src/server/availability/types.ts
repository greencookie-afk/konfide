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
  isVisibleInBrowse: boolean;
  awayTimeoutMinutes: number;
};
