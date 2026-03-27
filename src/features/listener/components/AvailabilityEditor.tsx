"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import type { AvailabilityEditorData } from "@/server/availability/types";

type AvailabilityEditorProps = {
  initialData: AvailabilityEditorData;
};

export default function AvailabilityEditor({ initialData }: AvailabilityEditorProps) {
  const [acceptingNewBookings, setAcceptingNewBookings] = useState(initialData.acceptingNewBookings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/listener/availability", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acceptingNewBookings,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not update availability.");
          return;
        }

        setMessage(acceptingNewBookings ? "You are now visible in browse." : "You are now hidden from browse.");
      } catch {
        setError("We could not update availability.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Live availability</p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">Use one switch to go live when you are ready.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Turning this on makes your published listener profile visible in browse so people can send you chat requests
          right away. Turning it off hides you until you are ready again.
        </p>

        <div className="mt-6 rounded-[20px] border border-primary/10 bg-primary-container/55 p-5">
          <label className="flex items-center justify-between gap-4 rounded-[18px] bg-surface px-4 py-4">
            <div>
              <p className="font-semibold text-on-surface">Available now</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                {acceptingNewBookings
                  ? "People can find you in browse and send a request."
                  : "Your profile stays hidden from browse until you turn this back on."}
              </p>
            </div>
            <input
              type="checkbox"
              checked={acceptingNewBookings}
              onChange={(event) => setAcceptingNewBookings(event.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface">What happens next</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-on-surface-variant">
            <p>Only published listener profiles can appear in browse.</p>
            <p>When you are available, talkers can send a request with their topic and context.</p>
            <p>Once you accept, the chat opens immediately for both sides.</p>
          </div>
        </section>

        {!initialData.isPublished ? (
          <section className="rounded-[22px] border border-primary/10 bg-primary-container p-5 shadow-sm">
            <p className="font-semibold text-on-primary-container">Publish your profile first</p>
            <p className="mt-2 text-sm leading-6 text-on-primary-container/80">
              Your availability button only affects browse once your public listener profile is published.
            </p>
          </section>
        ) : null}

        <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Save availability
          </button>

          {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        </section>
      </aside>
    </div>
  );
}
