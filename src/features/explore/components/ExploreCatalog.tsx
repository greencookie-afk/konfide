import Link from "next/link";
import ExploreFiltersBar from "@/features/explore/components/ExploreFiltersBar";
import ExploreHero from "@/features/explore/components/ExploreHero";
import ExplorePagination from "@/features/explore/components/ExplorePagination";
import ListenerCard from "@/features/explore/components/ListenerCard";
import { buildExploreHref } from "@/features/explore/components/exploreHref";
import type { BrowseListenersResult } from "@/server/listeners/types";

type ExploreCatalogProps = {
  browseResult: BrowseListenersResult;
};

export default function ExploreCatalog({ browseResult }: ExploreCatalogProps) {
  const { filters, listeners, topics, total, totalPages } = browseResult;

  return (
    <div className="space-y-5">
      <ExploreHero filters={filters} total={total} />
      <ExploreFiltersBar filters={filters} topics={topics} total={total} visibleCount={listeners.length} />

      {listeners.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {listeners.map((listener) => (
            <ListenerCard key={listener.userId} listener={listener} />
          ))}
        </section>
      ) : (
        <section className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">No matching listeners yet</p>
          <h2 className="mt-3 text-2xl font-bold">Try widening your filters.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
            No published listener matched the current search and topic filters. Clear one of the filters or jump back
            to the full explore list.
          </p>
          <div className="mt-6">
            <Link
              href={buildExploreHref(filters, {
                page: 1,
                query: "",
                topic: null,
                sort: "recent",
              })}
              className="inline-flex rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
            >
              Reset filters
            </Link>
          </div>
        </section>
      )}

      <ExplorePagination filters={filters} totalPages={totalPages} />
    </div>
  );
}
