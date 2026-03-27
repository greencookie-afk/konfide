import "server-only";
import { isListenerActiveNow } from "@/server/availability/service";
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

  return "recent";
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
  const isAcceptingRequests = record.user.listenerSettings?.acceptingNewBookings ?? false;

  return {
    userId: record.user.id,
    slug: record.slug,
    name: record.user.name ?? "Listener",
    avatarUrl: record.user.avatarUrl,
    headline: record.headline ?? "",
    about: record.about ?? "",
    specialties: record.specialties,
    languages: record.languages,
    isAcceptingRequests,
    isActiveNow: isListenerActiveNow({
      acceptingNewBookings: isAcceptingRequests,
      lastActiveAt: record.user.listenerSettings?.lastActiveAt ?? null,
    }),
  };
}

function sortListeners(listeners: ListenerSummary[], sort: ListenerSort) {
  if (sort === "name") {
    return [...listeners].sort((left, right) => left.name.localeCompare(right.name));
  }

  return [...listeners].sort((left, right) => {
    if (left.isActiveNow !== right.isActiveNow) {
      return Number(right.isActiveNow) - Number(left.isActiveNow);
    }

    if (left.isAcceptingRequests !== right.isAcceptingRequests) {
      return Number(right.isAcceptingRequests) - Number(left.isAcceptingRequests);
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

  if (!listener) {
    return null;
  }

  const isAcceptingRequests = listener.user.listenerSettings?.acceptingNewBookings ?? false;

  return {
    userId: listener.user.id,
    slug: listener.slug,
    name: listener.user.name ?? "Listener",
    avatarUrl: listener.user.avatarUrl,
    headline: listener.headline ?? "",
    about: listener.about ?? "",
    specialties: listener.specialties,
    languages: listener.languages,
    isAcceptingRequests,
    isActiveNow: isListenerActiveNow({
      acceptingNewBookings: isAcceptingRequests,
      lastActiveAt: listener.user.listenerSettings?.lastActiveAt ?? null,
    }),
    isPublished: listener.isPublished,
  };
}

export async function getListenerProfileEditorData(userId: string): Promise<ListenerProfileEditorData> {
  const user = await findListenerProfileByUserId(userId);

  return {
    name: user?.name ?? "",
    avatarUrl: user?.avatarUrl ?? null,
    isAcceptingRequests: user?.listenerSettings?.acceptingNewBookings ?? false,
    slug: user?.listenerProfile?.slug ?? "",
    headline: user?.listenerProfile?.headline ?? "",
    about: user?.listenerProfile?.about ?? "",
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
  const isPublished = Boolean(input.isPublished);

  if (!slug) {
    throw new Error("Choose a public profile slug before saving.");
  }

  if (await isListenerSlugTaken(slug, userId)) {
    throw new Error("That public profile URL is already taken.");
  }

  if (headline && headline.length > 120) {
    throw new Error("Keep your headline under 120 characters.");
  }

  if (about && about.length > 2000) {
    throw new Error("Keep your about section under 2000 characters.");
  }

  if (specialties.length > 12 || specialties.some((value) => value.length > 40)) {
    throw new Error("Add up to 12 specialties and keep each one under 40 characters.");
  }

  if (languages.length > 8 || languages.some((value) => value.length > 30)) {
    throw new Error("Add up to 8 languages and keep each one under 30 characters.");
  }

  return upsertListenerProfile(userId, {
    slug,
    headline,
    about,
    specialties,
    languages,
    isPublished,
  });
}
