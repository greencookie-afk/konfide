import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleDot, Languages, MessageSquareMore } from "lucide-react";
import type { ListenerSummary } from "@/server/listeners/types";

type ListenerCardProps = {
  listener: ListenerSummary;
};

export default function ListenerCard({ listener }: ListenerCardProps) {
  return (
    <article className="flex h-full flex-col border border-on-surface/8 bg-surface-container-lowest p-4 transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-surface-container-highest ring-1 ring-on-surface/5">
            {listener.avatarUrl ? (
              <Image
                src={listener.avatarUrl}
                alt={`${listener.name} portrait`}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-on-surface">
                {listener.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-on-surface">{listener.name}</h2>
            <p className="mt-1 text-sm text-on-surface">{listener.headline}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
            listener.isAvailableNow
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface text-on-surface-variant ring-1 ring-on-surface/8"
          }`}
        >
          <CircleDot className="h-3.5 w-3.5" />
          {listener.isAvailableNow ? "Available now" : "Unavailable"}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-on-surface-variant">{listener.about}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="bg-surface px-3 py-3 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2 text-on-surface">
            <MessageSquareMore className="h-4 w-4 text-primary" />
            <span className="font-semibold">How it starts</span>
          </div>
          <p className="mt-2 text-sm">Send a request and wait for acceptance.</p>
        </div>
        <div className="bg-surface px-3 py-3 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2 text-on-surface">
            <Languages className="h-4 w-4 text-primary" />
            <span className="font-semibold">Languages</span>
          </div>
          <p className="mt-2 text-sm">{listener.languages.join(", ") || "Not listed yet"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {listener.specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className="bg-surface px-2 py-1 text-[11px] font-semibold text-on-surface-variant ring-1 ring-on-surface/5"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Link
          href={`/explore/${listener.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
        >
          View profile
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/explore/${listener.slug}/connect`}
          className="inline-flex items-center justify-center border border-on-surface/10 bg-surface px-4 py-3 text-sm font-semibold text-on-surface transition hover:border-primary/20 hover:text-primary"
        >
          Request chat
        </Link>
      </div>
    </article>
  );
}
