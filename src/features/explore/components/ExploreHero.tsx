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
    <section className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Explore listeners</p>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Find a listener who is ready to connect now.</h1>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant md:text-base">
            Published listeners appear here when their live availability is turned on. Browse quickly, open a profile,
            and send a chat request when the fit feels right.
          </p>
        </div>
        <div className="rounded-[16px] border border-on-surface/5 bg-surface px-4 py-4 text-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">{total}</span> listener{total === 1 ? "" : "s"} available now
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
            className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-12 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          {hasFilters ? (
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-[16px] border border-on-surface/10 px-5 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary/20 hover:text-on-surface"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
