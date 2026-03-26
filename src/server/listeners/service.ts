import "server-only";
import {
  buildBookableCalendarFromSource,
  getDefaultListenerSettings,
} from "@/server/availability/service";
import {
  countPublishedListenerProfiles,
  findListenerProfileByUserId,
  findPublishedListenerBySlug,
  isListenerSlugTaken,
  listListenerTopics,
  listPublishedListenerProfiles,
  upsertListenerProfile,
} from "@/server/listeners/repository";
import {
  LISTENER_PAGE_SIZE,
  LISTENER_SORTS,
  type BrowseListenersFilters,
  type BrowseListenersResult,
  type ListenerDetail,
  type ListenerProfileEditorData,
  type ListenerSort,
  type ListenerSummary,
} from "@/server/listeners/types";

type BrowseListenersInput = {
  page?: string | null;
  q?: string | null;
  query?: string | null;
  topic?: string | null;
  sort?: string | null;
};

export type ListenerProfileInput = {
  slug?: string;
  headline?: string;
  about?: string;
  ratePerMinuteCents?: number | null;
  specialties?: string[];
  languages?: string[];
  isPublished?: boolean;
};

function readPositiveInteger(value: string | null | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

function normalizeSort(value: string | null | undefined): ListenerSort {
  if (value && LISTENER_SORTS.includes(value as ListenerSort)) {
    return value as ListenerSort;
  }

  return "soonest";
}

function normalizeList(values: string[] | undefined) {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

function normalizeSlug(value: string | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function mapListener(record: Awaited<ReturnType<typeof listPublishedListenerProfiles>>[number]): ListenerSummary {
  const settings = record.user.listenerSettings ?? getDefaultListenerSettings();
  const calendar = buildBookableCalendarFromSource(
    {
      settings,
      slots: record.user.listenerAvailabilitySlots,
      bookings: [],
    },
    settings.defaultSessionMinutes
  );

  return {
    userId: record.user.id,
    slug: record.slug,
    name: record.user.name ?? "Listener",
    avatarUrl: record.user.avatarUrl,
    headline: record.headline ?? "",
    about: record.about ?? "",
    ratePerMinuteCents: record.ratePerMinuteCents ?? 0,
    defaultSessionMinutes: settings.defaultSessionMinutes,
    specialties: record.specialties,
    languages: record.languages,
    timezone: settings.timezone,
    acceptingNewBookings: settings.acceptingNewBookings,
    nextAvailableAt: calendar.nextAvailableAt,
  };
}

function sortListeners(listeners: ListenerSummary[], sort: ListenerSort) {
  return [...listeners].sort((left, right) => {
    if (sort === "price-low") {
      return left.ratePerMinuteCents - right.ratePerMinuteCents || left.name.localeCompare(right.name);
    }

    if (sort === "price-high") {
      return right.ratePerMinuteCents - left.ratePerMinuteCents || left.name.localeCompare(right.name);
    }

    if (left.nextAvailableAt && right.nextAvailableAt) {
      return new Date(left.nextAvailableAt).getTime() - new Date(right.nextAvailableAt).getTime();
    }

    if (left.nextAvailableAt) {
      return -1;
    }

    if (right.nextAvailableAt) {
      return 1;
    }

    return left.name.localeCompare(right.name);
  });
}

export function normalizeBrowseListenersInput(input: BrowseListenersInput): BrowseListenersFilters {
  const query = (input.q ?? input.query ?? "").trim();
  const topic = (input.topic ?? "").trim();

  return {
    page: readPositiveInteger(input.page, 1),
    pageSize: LISTENER_PAGE_SIZE,
    query,
    topic: topic || null,
    sort: normalizeSort(input.sort),
  };
}

export async function getBrowseListeners(filters: BrowseListenersFilters): Promise<BrowseListenersResult> {
  const [profiles, total, topics] = await Promise.all([
    listPublishedListenerProfiles(filters),
    countPublishedListenerProfiles(filters),
    listListenerTopics(),
  ]);
  const sortedListeners = sortListeners(profiles.map(mapListener), filters.sort);
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(filters.page, totalPages);
  const pageStart = (page - 1) * filters.pageSize;

  return {
    filters: {
      ...filters,
      page,
    },
    listeners: sortedListeners.slice(pageStart, pageStart + filters.pageSize),
    topics,
    total,
    totalPages,
  };
}

export async function getListenerProfile(slug: string): Promise<ListenerDetail | null> {
  const listener = await findPublishedListenerBySlug(slug);

  if (!listener || !listener.user.listenerSettings) {
    return null;
  }

  const calendar = buildBookableCalendarFromSource(
    {
      settings: listener.user.listenerSettings,
      slots: listener.user.listenerAvailabilitySlots,
      bookings: [],
    },
    listener.user.listenerSettings.defaultSessionMinutes
  );

  return {
    userId: listener.user.id,
    slug: listener.slug,
    name: listener.user.name ?? "Listener",
    avatarUrl: listener.user.avatarUrl,
    headline: listener.headline ?? "",
    about: listener.about ?? "",
    ratePerMinuteCents: listener.ratePerMinuteCents ?? 0,
    defaultSessionMinutes: listener.user.listenerSettings.defaultSessionMinutes,
    specialties: listener.specialties,
    languages: listener.languages,
    timezone: listener.user.listenerSettings.timezone,
    acceptingNewBookings: listener.user.listenerSettings.acceptingNewBookings,
    nextAvailableAt: calendar.nextAvailableAt,
    isPublished: listener.isPublished,
    availabilityDayCount: listener.user.listenerAvailabilitySlots.length,
  };
}

export async function getListenerProfileEditorData(userId: string): Promise<ListenerProfileEditorData> {
  const user = await findListenerProfileByUserId(userId);

  return {
    name: user?.name ?? "",
    avatarUrl: user?.avatarUrl ?? null,
    slug: user?.listenerProfile?.slug ?? "",
    headline: user?.listenerProfile?.headline ?? "",
    about: user?.listenerProfile?.about ?? "",
    ratePerMinuteCents: user?.listenerProfile?.ratePerMinuteCents ?? null,
    specialties: user?.listenerProfile?.specialties ?? [],
    languages: user?.listenerProfile?.languages ?? [],
    isPublished: user?.listenerProfile?.isPublished ?? false,
  };
}

export async function saveListenerProfile(userId: string, input: ListenerProfileInput) {
  const slug = normalizeSlug(input.slug);
  const headline = input.headline?.trim() || null;
  const about = input.about?.trim() || null;
  const specialties = normalizeList(input.specialties);
  const languages = normalizeList(input.languages);
  const ratePerMinuteCents = input.ratePerMinuteCents ?? null;
  const isPublished = Boolean(input.isPublished);

  if (!slug) {
    throw new Error("Choose a public profile slug before saving.");
  }

  if (await isListenerSlugTaken(slug, userId)) {
    throw new Error("That public profile URL is already taken.");
  }

  if (ratePerMinuteCents !== null && (!Number.isInteger(ratePerMinuteCents) || ratePerMinuteCents < 1)) {
    throw new Error("Set a valid price per minute.");
  }

  if (isPublished && (!headline || !about || !ratePerMinuteCents || specialties.length === 0)) {
    throw new Error("Complete the headline, about, price, and specialties before publishing.");
  }

  return upsertListenerProfile(userId, {
    slug,
    headline,
    about,
    ratePerMinuteCents,
    specialties,
    languages,
    isPublished,
  });
}
