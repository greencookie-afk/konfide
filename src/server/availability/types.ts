export type ListenerSettingsSnapshot = {
  timezone: string;
  defaultSessionMinutes: number;
  bufferMinutes: number;
  acceptingNewBookings: boolean;
};

export type AvailabilityEditorData = {
  acceptingNewBookings: boolean;
  isPublished: boolean;
};
