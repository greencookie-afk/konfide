import Link from "next/link";
import { CalendarDays, Settings2 } from "lucide-react";
import { requireUser } from "@/server/auth/server";
import { getListenerSessions } from "@/server/sessions/service";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ListenerSessionsPage() {
  const user = await requireUser(["LISTENER"]);
  const sessions = await getListenerSessions(user.id);
  const now = new Date();
  const upcoming = sessions.filter((session) => session.status === "CONFIRMED" && session.scheduledAt >= now);
  const history = sessions.filter((session) => !upcoming.some((upcomingSession) => upcomingSession.id === session.id));

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Sessions</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Manage incoming bookings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          Confirmed user bookings show up here automatically after they reserve a real time slot from your profile.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming bookings</h2>
          </div>
          <div className="mt-5 space-y-3">
            {upcoming.length ? (
              upcoming.map((session) => (
                <article key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-on-surface">{session.counterpartyName}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{session.topic || "Support session"}</p>
                    </div>
                    <span className="rounded-[12px] bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container">
                      Confirmed
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-on-surface-variant">{formatDateTime(session.scheduledAt)}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {session.durationMinutes} minutes · {formatCurrency(session.totalAmountCents)}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                No upcoming bookings yet. Publish your profile and open time blocks in availability to start receiving
                bookings.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-on-primary-container">Need to adjust your calendar?</h2>
            <p className="mt-3 text-sm leading-6 text-on-primary-container/80">
              Update availability before users book the wrong times. New openings and pauses take effect from your
              saved schedule.
            </p>
            <div className="mt-5">
              <Link
                href="/listener/availability"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
              >
                <Settings2 className="h-4 w-4" />
                Manage calendar settings
              </Link>
            </div>
          </section>

          <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-on-surface">Recent history</h2>
            <div className="mt-5 space-y-3">
              {history.length ? (
                history.map((session) => (
                  <article key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                    <p className="font-semibold text-on-surface">{session.counterpartyName}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{session.topic || "Support session"}</p>
                    <p className="mt-3 text-sm text-on-surface-variant">{formatDateTime(session.scheduledAt)}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                  Completed or older sessions will appear here as your calendar starts filling up.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
