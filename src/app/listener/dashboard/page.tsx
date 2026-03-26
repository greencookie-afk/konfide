import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  NotebookPen,
  Settings2,
  Sparkles,
} from "lucide-react";
import { getDefaultListenerSettings } from "@/server/availability/service";
import { requireUser } from "@/server/auth/server";
import { getListenerDashboardData } from "@/server/sessions/service";

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function ListenerDashboardPage() {
  const user = await requireUser(["LISTENER"]);
  const dashboard = await getListenerDashboardData(user.id);
  const settings = dashboard.settings ?? getDefaultListenerSettings();
  const isPublished = Boolean(dashboard.profile?.isPublished);
  const hasProfile = Boolean(dashboard.profile);

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Listener dashboard</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome back, {dashboard.name}.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          Everything here is driven by your actual profile, availability, and booked sessions. No demo metrics are
          shown.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-sm text-on-surface-variant">Total earnings</p>
          <p className="mt-2 text-3xl font-bold text-on-surface">{formatCurrency(dashboard.totalEarningsCents)}</p>
          <p className="mt-2 text-sm text-on-surface-variant">{dashboard.completedSessionsCount} completed session(s)</p>
        </article>
        <article className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-sm text-on-surface-variant">Profile completion</p>
          <p className="mt-2 text-3xl font-bold text-on-surface">{dashboard.profileCompletion}%</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {isPublished ? "Published and visible in browse" : "Not published to users yet"}
          </p>
        </article>
        <article className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-sm text-on-surface-variant">Upcoming sessions</p>
          <p className="mt-2 text-3xl font-bold text-on-surface">{dashboard.upcomingSessionsCount}</p>
          <p className="mt-2 text-sm text-on-surface-variant">{dashboard.availabilityDays} day(s) open on your calendar</p>
        </article>
        <article className="rounded-[18px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-sm text-on-surface-variant">Booking status</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{settings.acceptingNewBookings ? "Accepting" : "Paused"}</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {settings.defaultSessionMinutes} min sessions, {settings.bufferMinutes} min buffer
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-primary-container">Workspace status</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-on-primary-container">
                {hasProfile ? "Your listener listing is saved." : "Your listener profile has not been started yet."}
              </h2>
            </div>
            <Sparkles className="h-5 w-5 text-on-primary-container" />
          </div>

          <div className="mt-5 grid gap-3 rounded-[16px] bg-surface px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Public URL</span>
              <span className="font-semibold text-on-surface">
                {dashboard.profile?.slug ? `/explore/${dashboard.profile.slug}` : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Visibility</span>
              <span className="font-semibold text-on-surface">{isPublished ? "Published" : "Draft"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Rate</span>
              <span className="font-semibold text-on-surface">
                {dashboard.profile?.ratePerMinuteCents ? `${formatCurrency(dashboard.profile.ratePerMinuteCents)}/min` : "Not set"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/listener/profile"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
            >
              <NotebookPen className="h-4 w-4" />
              Edit public profile
            </Link>
            <Link
              href="/listener/availability"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-on-primary-container/20 px-5 py-3 text-sm font-semibold text-on-primary-container transition hover:bg-white/20"
            >
              <Settings2 className="h-4 w-4" />
              Manage availability
            </Link>
          </div>
        </article>

        <article className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-on-surface">Booking settings</h2>
          <div className="mt-5 space-y-4 text-sm text-on-surface-variant">
            <div className="flex items-start gap-3 rounded-[16px] bg-surface px-4 py-4">
              <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold text-on-surface">Timezone</p>
                <p className="mt-1">{settings.timezone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[16px] bg-surface px-4 py-4">
              <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold text-on-surface">Session defaults</p>
                <p className="mt-1">{settings.defaultSessionMinutes} minute sessions with a {settings.bufferMinutes} minute buffer</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[16px] bg-surface px-4 py-4">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold text-on-surface">Availability</p>
                <p className="mt-1">
                  {dashboard.availabilityDays > 0
                    ? `${dashboard.availabilityDays} day(s) currently open for users to book`
                    : "Add availability blocks before users can see bookable times."}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming bookings</h2>
          </div>
          <div className="mt-5 space-y-3">
            {dashboard.upcomingSessions.length ? (
              dashboard.upcomingSessions.map((session) => (
                <div key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                  <p className="font-semibold text-on-surface">{session.topic || "Support session"}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{formatDateTime(session.scheduledAt)}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {session.durationMinutes} minutes · {formatCurrency(session.totalAmountCents)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                No upcoming bookings yet. Once someone confirms a session, it will appear here automatically.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Recent completed sessions</h2>
          </div>
          <div className="mt-5 space-y-3">
            {dashboard.recentCompletedSessions.length ? (
              dashboard.recentCompletedSessions.map((session) => (
                <div key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                  <p className="font-semibold text-on-surface">{session.topic || "Support session"}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{formatDateTime(session.scheduledAt)}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Earned {formatCurrency(session.totalAmountCents)} from this session
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                Earnings will start appearing after your first completed session.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
