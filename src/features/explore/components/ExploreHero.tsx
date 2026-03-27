import Link from "next/link";
import { Search } from "lucide-react";
import type { BrowseListenersFilters } from "@/server/listeners/types";

type ExploreHeroProps = {
  filters: BrowseListenersFilters;
  total: number;
};

export default function ExploreHero({ filters, total }: ExploreHeroProps) {
  const hasFilters = Boolean(filters.query || filters.topic || filters.sort !== "recent");

  return (
    <section className="border border-on-surface/8 bg-surface-container-lowest p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Explore listeners</p>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">Find a listener who is ready to connect now.</h1>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Published listeners stay here in explore. Browse quickly, spot who is active now, and send a chat request
            whenever a listener has requests turned on.
          </p>
        </div>
        <div className="border border-on-surface/10 bg-surface px-3 py-3 text-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">{total}</span> published listener{total === 1 ? "" : "s"}
        </div>
      </div>

      <form action="/explore" method="GET" className="mt-5 flex flex-col gap-3 md:flex-row">
        {filters.topic ? <input type="hidden" name="topic" value={filters.topic} /> : null}
        {filters.sort !== "recent" ? <input type="hidden" name="sort" value={filters.sort} /> : null}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
          <input
            type="text"
            name="q"
            defaultValue={filters.query}
            placeholder="Search by name, burnout, grief, relationships..."
            className="w-full border border-on-surface/10 bg-surface px-12 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          {hasFilters ? (
            <Link
              href="/explore"
              className="inline-flex items-center justify-center border border-on-surface/10 px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary/20 hover:text-on-surface"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
