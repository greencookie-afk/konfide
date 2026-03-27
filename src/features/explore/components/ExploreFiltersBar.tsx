import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { buildExploreHref } from "@/features/explore/components/exploreHref";
import type { BrowseListenersFilters, ListenerSort } from "@/server/listeners/types";

const SORT_OPTIONS: Array<{ value: ListenerSort; label: string }> = [
  { value: "recent", label: "Recently active" },
  { value: "name", label: "Name" },
];

type ExploreFiltersBarProps = {
  filters: BrowseListenersFilters;
  topics: string[];
  total: number;
  visibleCount: number;
};

export default function ExploreFiltersBar({ filters, topics, total, visibleCount }: ExploreFiltersBarProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">{visibleCount}</span> of{" "}
          <span className="font-semibold text-on-surface">{total}</span>
        </div>

        <form action="/explore" method="GET" className="flex flex-wrap items-center gap-3">
          {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
          {filters.topic ? <input type="hidden" name="topic" value={filters.topic} /> : null}
          <label className="inline-flex items-center gap-2 rounded-[14px] border border-on-surface/5 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Sort</span>
            <select
              name="sort"
              defaultValue={filters.sort}
              className="bg-transparent font-semibold text-on-surface outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-[14px] bg-on-surface px-4 py-3 text-sm font-semibold text-surface transition hover:opacity-90"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildExploreHref(filters, { topic: null, page: 1 })}
          className={`rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
            !filters.topic
              ? "bg-primary text-on-surface"
              : "border border-on-surface/10 bg-surface-container-lowest text-on-surface-variant hover:border-primary/20 hover:text-on-surface"
          }`}
        >
          All topics
        </Link>
        {topics.map((topic) => (
          <Link
            key={topic}
            href={buildExploreHref(filters, {
              topic,
              page: 1,
            })}
            className={`rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
              filters.topic === topic
                ? "bg-primary text-on-surface"
                : "border border-on-surface/10 bg-surface-container-lowest text-on-surface-variant hover:border-primary/20 hover:text-on-surface"
            }`}
          >
            {topic}
          </Link>
        ))}
      </div>
    </section>
  );
}
