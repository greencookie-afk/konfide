export const LISTENER_PAGE_SIZE = 4;

export const LISTENER_SORTS = ["soonest", "price-low", "price-high"] as const;

export type ListenerSort = (typeof LISTENER_SORTS)[number];

export type BrowseListenersFilters = {
  page: number;
  pageSize: number;
  query: string;
  topic: string | null;
  sort: ListenerSort;
};

export type ListenerSummary = {
  userId: string;
  slug: string;
  name: string;
  avatarUrl: string | null;
  headline: string;
  about: string;
  ratePerMinuteCents: number;
  defaultSessionMinutes: number;
  specialties: string[];
  languages: string[];
  timezone: string;
  acceptingNewBookings: boolean;
  nextAvailableAt: string | null;
};

export type ListenerDetail = ListenerSummary & {
  isPublished: boolean;
  availabilityDayCount: number;
};

export type BrowseListenersResult = {
  filters: BrowseListenersFilters;
  listeners: ListenerSummary[];
  topics: string[];
  total: number;
  totalPages: number;
};

export type ListenerProfileEditorData = {
  name: string;
  avatarUrl: string | null;
  slug: string;
  headline: string;
  about: string;
  ratePerMinuteCents: number | null;
  specialties: string[];
  languages: string[];
  isPublished: boolean;
};
