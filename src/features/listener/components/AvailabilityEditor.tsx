"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import BrowserNotificationCard from "@/components/shared/BrowserNotificationCard";
import type { AvailabilityEditorData } from "@/server/availability/types";

type AvailabilityEditorProps = {
  initialData: AvailabilityEditorData;
  notificationSettings: {
    browserNotificationsEnabled: boolean;
    browserNotificationPermission: string | null;
  };
};

export default function AvailabilityEditor({ initialData, notificationSettings }: AvailabilityEditorProps) {
  const [acceptingNewBookings, setAcceptingNewBookings] = useState(initialData.acceptingNewBookings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextExploreState = initialData.isListedInExplore ? "Listed in explore" : "Hidden until published";
  const nextRequestState = acceptingNewBookings ? "Requests on" : "Requests off";

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

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("listener-availability-changed", {
              detail: {
                acceptingNewBookings,
              },
            })
          );
        }

        setMessage(acceptingNewBookings ? "Requests are now on for this listener account." : "Requests are now off for this listener account.");
      } catch {
        setError("We could not update availability.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="border border-on-surface/8 bg-surface-container-lowest p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Live availability</p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">Use one switch to go live when you are ready.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Published listener profiles stay listed in explore. This switch only controls whether new requests can reach
          you, and the active badge appears while this workspace is still checking in.
        </p>

        <div className="mt-6 border border-primary/15 bg-primary-container/55 p-4">
          <label className="flex items-center justify-between gap-4 bg-surface px-3 py-3">
            <div>
              <p className="font-semibold text-on-surface">Accept new requests</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                {acceptingNewBookings
                  ? "People can send new requests, even if you step away briefly."
                  : "Your published profile stays visible, but new requests stop until you turn this back on."}
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="border border-on-surface/8 bg-surface px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Explore status</p>
            <p className="mt-2 text-sm font-semibold text-on-surface">{nextExploreState}</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Publishing controls whether your profile appears in explore.
            </p>
          </div>

          <div className="border border-on-surface/8 bg-surface px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Request status</p>
            <p className="mt-2 text-sm font-semibold text-on-surface">{nextRequestState}</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              The active now badge clears after {initialData.awayTimeoutMinutes} minutes away, but this toggle stays as you set it.
            </p>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <h2 className="text-lg font-bold text-on-surface">What happens next</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-on-surface-variant">
            <p>Published listener profiles stay visible in explore.</p>
            <p>Users can send requests whenever this toggle is on.</p>
            <p>The active now badge appears only while this workspace is still alive on the site.</p>
            <p>Once you accept, the chat opens immediately for both sides.</p>
          </div>
        </section>

        {!initialData.isPublished ? (
          <section className="border border-primary/15 bg-primary-container p-4">
            <p className="font-semibold text-on-primary-container">Publish your profile first</p>
            <p className="mt-2 text-sm leading-6 text-on-primary-container/80">
              Your requests switch only affects new chats once your public listener profile is published.
            </p>
          </section>
        ) : null}

        <BrowserNotificationCard
          description="Enable browser notifications on supported mobile browsers so new requests and accepted chats can surface faster."
          initialEnabled={notificationSettings.browserNotificationsEnabled}
          initialPermission={notificationSettings.browserNotificationPermission}
        />

        <section className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
