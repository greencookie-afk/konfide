"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { CalendarDays, Clock3, LoaderCircle, NotebookText } from "lucide-react";
import type { BookableCalendar } from "@/server/availability/types";

type BookingSessionFormProps = {
  canBook: boolean;
  listener: {
    slug: string;
    name: string;
    avatarUrl: string | null;
    headline: string;
    ratePerMinuteCents: number;
    defaultSessionMinutes: number;
    specialties: string[];
  };
  calendars: Array<{
    durationMinutes: number;
    calendar: BookableCalendar;
  }>;
};

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Choose a time";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function BookingSessionForm({ canBook, listener, calendars }: BookingSessionFormProps) {
  const [selectedDuration, setSelectedDuration] = useState(
    calendars.find((entry) => entry.durationMinutes === listener.defaultSessionMinutes)?.durationMinutes ??
      calendars[0]?.durationMinutes ??
      45
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeEntry = calendars.find((entry) => entry.durationMinutes === selectedDuration) ?? calendars[0];
  const activeCalendar = activeEntry?.calendar;
  const firstDateWithTimes = activeCalendar?.dates.find((date) => date.times.length);
  const preferredDate = activeCalendar?.dates.find((date) => date.isoDate === selectedDate);
  const activeDate = preferredDate?.times.length ? preferredDate : firstDateWithTimes ?? activeCalendar?.dates[0];
  const activeTime = activeDate?.times.find((time) => time.iso === selectedTime)?.iso ?? activeDate?.times[0]?.iso ?? "";
  const hasAnyBookableTimes = Boolean(activeCalendar?.dates.some((date) => date.times.length));

  const totalAmountCents = selectedDuration * listener.ratePerMinuteCents;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!activeTime) {
      setError("Choose a date and time before confirming the booking.");
      return;
    }

    if (!canBook) {
      setError("Only user accounts can confirm a booking.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listenerSlug: listener.slug,
            scheduledAtIso: activeTime,
            durationMinutes: selectedDuration,
            topic,
            notes,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not create the booking.");
          return;
        }

        window.location.assign("/sessions");
      } catch {
        setError("We could not create the booking right now.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
          <span className="text-primary">1. Choose time</span>
          <span>2. Add details</span>
          <span>3. Confirm</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-on-surface">Choose a duration</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {calendars.map((entry) => (
                  <button
                    key={entry.durationMinutes}
                    type="button"
                    onClick={() => setSelectedDuration(entry.durationMinutes)}
                    className={`rounded-[14px] border px-4 py-4 text-left transition ${
                      entry.durationMinutes === selectedDuration
                        ? "border-primary bg-primary-container text-on-surface"
                        : "border-on-surface/5 bg-surface text-on-surface-variant hover:border-primary/20 hover:text-on-surface"
                    }`}
                  >
                    <span className="block text-lg font-bold">{entry.durationMinutes}</span>
                    <span className="text-xs uppercase tracking-[0.18em]">minutes</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-on-surface">Choose your date</p>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {activeCalendar?.dates.map((date) => {
                  const isActive = date.isoDate === selectedDate;
                  const isDisabled = date.times.length === 0;

                  return (
                    <button
                      key={date.isoDate}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(date.isoDate);
                        setSelectedTime(date.times[0]?.iso ?? "");
                      }}
                      className={`rounded-[14px] border px-3 py-4 text-left transition ${
                        isActive
                          ? "border-primary bg-primary text-on-surface"
                          : isDisabled
                            ? "cursor-not-allowed border-on-surface/5 bg-surface text-on-surface/30"
                            : "border-on-surface/5 bg-surface text-on-surface hover:border-primary/20"
                      }`}
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em]">{date.shortLabel}</span>
                      <span className="mt-1 block text-2xl font-bold">{date.dayNumber}</span>
                      <span className="text-xs">{date.monthLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-on-surface">Available times</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {activeDate?.times.length ? (
                activeDate.times.map((time) => (
                  <button
                    key={time.iso}
                    type="button"
                    onClick={() => setSelectedTime(time.iso)}
                    className={`rounded-[14px] border px-4 py-3 text-sm font-semibold transition ${
                      activeTime === time.iso
                        ? "border-primary bg-on-surface text-surface"
                        : "border-on-surface/5 bg-surface text-on-surface hover:border-primary/20"
                    }`}
                  >
                    {time.label}
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                  {hasAnyBookableTimes
                    ? "No openings are left for this day."
                    : "This listener has not opened any bookable times yet."}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface">What would you like to talk about?</label>
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Stress, grief, work, relationships..."
              className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface">Anything you want the listener to know?</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Share context, goals, or anything you want to cover."
              rows={5}
              className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-[16px] bg-surface-container-highest">
              {listener.avatarUrl ? (
                <Image src={listener.avatarUrl} alt={`${listener.name} portrait`} fill sizes="56px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-on-surface">
                  {listener.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-on-primary-container">{listener.name}</p>
              <p className="text-sm text-on-primary-container/75">{listener.headline}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-[16px] bg-surface px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Rate</span>
              <span className="font-semibold text-on-surface">{formatCurrency(listener.ratePerMinuteCents)}/min</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Date & time</span>
              <span className="text-right font-semibold text-on-surface">{formatDateTime(activeTime)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Length</span>
              <span className="font-semibold text-on-surface">{selectedDuration} minutes</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-on-surface/5 pt-3">
              <span className="text-on-surface-variant">Total</span>
              <span className="text-xl font-bold text-on-surface">{formatCurrency(totalAmountCents)}</span>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || !canBook || !hasAnyBookableTimes}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {canBook ? "Confirm booking" : "Preview only"}
          </button>
        </section>

        <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-on-surface">Booking details</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                Sessions are stored immediately after confirmation and appear in both user and listener session views.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Real availability only</p>
              <p className="text-sm leading-6 text-on-surface-variant">
                The time grid only shows slots created from the listener&apos;s saved availability settings.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <NotebookText className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Payment comes later</p>
              <p className="text-sm leading-6 text-on-surface-variant">
                This step confirms the schedule now. Payment can be layered on top without changing the booking model.
              </p>
            </div>
          </div>
        </section>
      </aside>
    </form>
  );
}
