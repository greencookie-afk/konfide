import type { BrowseListenersFilters } from "@/server/listeners/types";

type ExploreHrefOverrides = Partial<Pick<BrowseListenersFilters, "page" | "query" | "topic" | "sort">>;

export function buildExploreHref(filters: BrowseListenersFilters, overrides: ExploreHrefOverrides = {}) {
  const nextFilters: BrowseListenersFilters = {
    ...filters,
    ...overrides,
  };
  const params = new URLSearchParams();

  if (nextFilters.query) {
    params.set("q", nextFilters.query);
  }

  if (nextFilters.topic) {
    params.set("topic", nextFilters.topic);
  }

  if (nextFilters.sort !== "soonest") {
    params.set("sort", nextFilters.sort);
  }

  if (nextFilters.page > 1) {
    params.set("page", String(nextFilters.page));
  }

  const queryString = params.toString();
  return queryString ? `/explore?${queryString}` : "/explore";
}
