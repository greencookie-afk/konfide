"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [slug, setSlug] = useState(initialData.slug);
  const [headline, setHeadline] = useState(initialData.headline);
  const [about, setAbout] = useState(initialData.about);
  const [specialties, setSpecialties] = useState(initialData.specialties.join(", "));
  const [languages, setLanguages] = useState(initialData.languages.join(", "));
  const [isPublished, setIsPublished] = useState(initialData.isPublished);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const specialtyList = splitList(specialties);

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

        setMessage("Profile saved. Opening dashboard...");
        router.push("/listener/dashboard");
        router.refresh();
      } catch {
        setError("We could not save your public profile.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="border border-on-surface/8 bg-surface-container-lowest p-4 sm:p-5">
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
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
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
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
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
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
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
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
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
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </label>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Live preview</p>
          <h3 className="mt-2 text-lg font-bold text-on-surface">{headline.trim() || initialData.name || "Your listener listing"}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            {about.trim() || "Your about section preview appears here as you shape the public listing."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="bg-surface px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Public URL</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{slug.trim() ? `/explore/${slug.trim()}` : "Set your slug"}</p>
            </div>
            <div className="bg-surface px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Requests</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">
                {initialData.isAcceptingRequests ? "Requests are on" : "Requests are off"}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-surface px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Specialties</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              {specialtyList.length ? specialtyList.join(", ") : "Add specialties so users can quickly understand what you support."}
            </p>
          </div>
        </section>

        <section className="border border-primary/15 bg-primary-container p-4">
          <label className="flex items-start justify-between gap-4 bg-surface px-3 py-3">
            <div>
              <p className="font-semibold text-on-surface">Publish profile</p>
              <p className="text-sm leading-6 text-on-surface-variant">
                Published listener profiles stay visible in explore, even when requests are off.
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

        <section className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-on-surface/8 pb-4">
            <p className="text-sm text-on-surface-variant">
              {initialData.isAcceptingRequests
                ? "Requests are currently on for this listener account."
                : "Turn requests on when you want to receive new chats."}
            </p>
            <Link href="/listener/availability" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Availability
            </Link>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
