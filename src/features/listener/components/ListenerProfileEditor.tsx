"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import type { ListenerProfileEditorData } from "@/server/listeners/types";

type ListenerProfileEditorProps = {
  initialData: ListenerProfileEditorData;
};

function splitList(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

export default function ListenerProfileEditor({ initialData }: ListenerProfileEditorProps) {
  const [slug, setSlug] = useState(initialData.slug);
  const [headline, setHeadline] = useState(initialData.headline);
  const [about, setAbout] = useState(initialData.about);
  const [ratePerMinute, setRatePerMinute] = useState(
    initialData.ratePerMinuteCents ? (initialData.ratePerMinuteCents / 100).toFixed(2) : ""
  );
  const [specialties, setSpecialties] = useState(initialData.specialties.join(", "));
  const [languages, setLanguages] = useState(initialData.languages.join(", "));
  const [isPublished, setIsPublished] = useState(initialData.isPublished);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/listener/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            headline,
            about,
            ratePerMinuteCents: ratePerMinute ? Math.round(Number(ratePerMinute) * 100) : null,
            specialties: splitList(specialties),
            languages: splitList(languages),
            isPublished,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not save your public profile.");
          return;
        }

        setMessage("Public profile saved.");
      } catch {
        setError("We could not save your public profile.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Public profile URL
            </span>
            <input
              type="text"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="sarah-jones"
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Headline
            </span>
            <input
              type="text"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Gentle support for stress, grief, or major life changes"
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Rate per minute (USD)
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={ratePerMinute}
              onChange={(event) => setRatePerMinute(event.target.value)}
              placeholder="1.00"
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Languages
            </span>
            <input
              type="text"
              value={languages}
              onChange={(event) => setLanguages(event.target.value)}
              placeholder="English, Hindi"
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Specialties
            </span>
            <input
              type="text"
              value={specialties}
              onChange={(event) => setSpecialties(event.target.value)}
              placeholder="Anxiety, Grief, Workplace Stress"
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              About
            </span>
            <textarea
              rows={8}
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="Describe how you support people, what you are best at listening to, and what someone can expect from a session."
              className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[22px] border border-primary/10 bg-primary-container p-5 shadow-sm">
          <label className="flex items-start justify-between gap-4 rounded-[18px] bg-surface px-4 py-4">
            <div>
              <p className="font-semibold text-on-surface">Publish profile</p>
              <p className="text-sm leading-6 text-on-surface-variant">
                Published listener profiles appear on browse and can receive bookings.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="mt-1 h-5 w-5 accent-primary"
            />
          </label>
        </section>

        <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Save public profile
          </button>

          {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        </section>
      </aside>
    </div>
  );
}
