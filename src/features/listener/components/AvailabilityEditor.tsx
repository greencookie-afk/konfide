"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import type { AvailabilityEditorData } from "@/server/availability/types";

const TIME_OPTIONS = Array.from({ length: 72 }, (_, index) => index * 15);

function formatMinuteLabel(minute: number) {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  const date = new Date(2000, 0, 1, hours, minutes);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

type AvailabilityEditorProps = {
  initialData: AvailabilityEditorData;
};

export default function AvailabilityEditor({ initialData }: AvailabilityEditorProps) {
  const [days, setDays] = useState(initialData.days);
  const [timezone, setTimezone] = useState(initialData.settings.timezone);
  const [defaultSessionMinutes, setDefaultSessionMinutes] = useState(initialData.settings.defaultSessionMinutes);
  const [bufferMinutes, setBufferMinutes] = useState(initialData.settings.bufferMinutes);
  const [acceptingNewBookings, setAcceptingNewBookings] = useState(initialData.settings.acceptingNewBookings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const addSlot = (dayOfWeek: number) => {
    setDays((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: [...day.slots, { dayOfWeek, startMinute: 9 * 60, endMinute: 10 * 60 }],
            }
          : day
      )
    );
  };

  const updateSlot = (dayOfWeek: number, slotIndex: number, key: "startMinute" | "endMinute", value: number) => {
    setDays((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: day.slots.map((slot, index) => (index === slotIndex ? { ...slot, [key]: value } : slot)),
            }
          : day
      )
    );
  };

  const removeSlot = (dayOfWeek: number, slotIndex: number) => {
    setDays((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: day.slots.filter((_, index) => index !== slotIndex),
            }
          : day
      )
    );
  };

  const handleSave = async () => {
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
            timezone,
            defaultSessionMinutes,
            bufferMinutes,
            acceptingNewBookings,
            slots: days.flatMap((day) => day.slots),
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not save availability.");
          return;
        }

        setMessage("Availability saved.");
      } catch {
        setError("We could not save availability.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-[22px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {days.map((day) => (
            <article key={day.dayOfWeek} className="rounded-[18px] border border-on-surface/5 bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    {day.shortLabel}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-on-surface">{day.longLabel}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => addSlot(day.dayOfWeek)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-on-surface/10 text-on-surface transition hover:border-primary/25 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {day.slots.length ? (
                  day.slots.map((slot, index) => (
                    <div key={`${day.dayOfWeek}-${index}`} className="rounded-[16px] border border-on-surface/5 bg-surface-container-low px-3 py-3">
                      <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                        <select
                          value={slot.startMinute}
                          onChange={(event) => updateSlot(day.dayOfWeek, index, "startMinute", Number(event.target.value))}
                          className="rounded-[12px] border border-on-surface/5 bg-surface px-2 py-2 text-xs outline-none"
                        >
                          {TIME_OPTIONS.map((minute) => (
                            <option key={`start-${minute}`} value={minute}>
                              {formatMinuteLabel(minute)}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-on-surface-variant">to</span>
                        <select
                          value={slot.endMinute}
                          onChange={(event) => updateSlot(day.dayOfWeek, index, "endMinute", Number(event.target.value))}
                          className="rounded-[12px] border border-on-surface/5 bg-surface px-2 py-2 text-xs outline-none"
                        >
                          {TIME_OPTIONS.map((minute) => (
                            <option key={`end-${minute}`} value={minute}>
                              {formatMinuteLabel(minute)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSlot(day.dayOfWeek, index)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface-container-low px-3 py-4 text-sm text-on-surface-variant">
                    No time blocks yet.
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[22px] border border-primary/10 bg-primary-container p-5 shadow-sm">
          <h2 className="text-lg font-bold text-on-primary-container">Quick settings</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-primary-container/70">
                Default session length
              </span>
              <select
                value={defaultSessionMinutes}
                onChange={(event) => setDefaultSessionMinutes(Number(event.target.value))}
                className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-3 py-3 text-sm outline-none"
              >
                {[15, 30, 45, 60].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} minutes
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-primary-container/70">
                Buffer between sessions
              </span>
              <select
                value={bufferMinutes}
                onChange={(event) => setBufferMinutes(Number(event.target.value))}
                className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-3 py-3 text-sm outline-none"
              >
                {[0, 15, 30, 45, 60].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} minutes
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-primary-container/70">
                Timezone
              </span>
              <input
                type="text"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-3 py-3 text-sm outline-none"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-[16px] bg-surface px-4 py-4">
              <div>
                <p className="font-semibold text-on-surface">Accepting new bookings</p>
                <p className="text-sm text-on-surface-variant">Turn this off anytime to pause new session requests.</p>
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
