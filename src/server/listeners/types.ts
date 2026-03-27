export const LISTENER_PAGE_SIZE = 4;

export const LISTENER_SORTS = ["recent", "name"] as const;

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
  specialties: string[];
  languages: string[];
  isAcceptingRequests: boolean;
  isActiveNow: boolean;
};

export type ListenerDetail = ListenerSummary & {
  isPublished: boolean;
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
  isAcceptingRequests: boolean;
  slug: string;
  headline: string;
  about: string;
  specialties: string[];
  languages: string[];
  isPublished: boolean;
};
