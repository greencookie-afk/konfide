import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildExploreHref } from "@/features/explore/components/exploreHref";
import type { BrowseListenersFilters } from "@/server/listeners/types";

type ExplorePaginationProps = {
  filters: BrowseListenersFilters;
  totalPages: number;
};

export default function ExplorePagination({ filters, totalPages }: ExplorePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Explore pagination">
      <Link
        href={buildExploreHref(filters, { page: Math.max(1, filters.page - 1) })}
        aria-disabled={filters.page === 1}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border transition ${
          filters.page === 1
            ? "pointer-events-none border-on-surface/5 text-on-surface/25"
            : "border-on-surface/10 bg-surface-container-lowest text-on-surface hover:border-primary/20"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildExploreHref(filters, { page })}
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] px-4 text-sm font-semibold transition ${
            page === filters.page
              ? "bg-primary text-on-surface"
              : "border border-on-surface/10 bg-surface-container-lowest text-on-surface hover:border-primary/20"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildExploreHref(filters, { page: Math.min(totalPages, filters.page + 1) })}
        aria-disabled={filters.page === totalPages}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border transition ${
          filters.page === totalPages
            ? "pointer-events-none border-on-surface/5 text-on-surface/25"
            : "border-on-surface/10 bg-surface-container-lowest text-on-surface hover:border-primary/20"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
