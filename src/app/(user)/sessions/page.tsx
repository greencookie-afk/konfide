import Link from "next/link";
import { CalendarClock, Clock3, MessageSquareText } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { requireUser } from "@/server/auth/server";
import { getTalkerSessions } from "@/server/sessions/service";

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

export default async function UserSessionsPage() {
  const user = await requireUser(["TALKER"]);
  const sessions = await getTalkerSessions(user.id);
  const now = new Date();
  const upcoming = sessions.filter((session) => session.status === "CONFIRMED" && session.scheduledAt >= now);
  const history = sessions.filter((session) => !upcoming.some((upcomingSession) => upcomingSession.id === session.id));

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">Sessions</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Your booked sessions</h1>
          <p className="max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
            Every confirmed booking appears here automatically. If nothing is booked yet, this page stays empty on
            purpose.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Upcoming sessions</h2>
            </div>
            <div className="space-y-4">
              {upcoming.length ? (
                upcoming.map((session) => (
                  <article key={session.id} className="rounded-[16px] border border-on-surface/5 bg-surface p-5">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <h3 className="font-bold text-on-surface">{session.topic || "Support session"}</h3>
                      <span className="rounded-[12px] bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">with {session.counterpartyName}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-on-surface-variant">
                      <span>{formatDateTime(session.scheduledAt)}</span>
                      <span>{session.durationMinutes} minutes</span>
                      <span>{formatCurrency(session.totalAmountCents)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                  No upcoming sessions yet. Once you confirm a booking from a listener profile, it will show up here.
                </div>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <MessageSquareText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Previous activity</h2>
              </div>
              <div className="space-y-4">
                {history.length ? (
                  history.map((session) => (
                    <article key={session.id} className="rounded-[16px] bg-surface p-5">
                      <h3 className="font-bold">{session.topic || "Support session"}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">{session.counterpartyName}</p>
                      <p className="mt-3 text-sm text-on-surface-variant">{formatDateTime(session.scheduledAt)}</p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                    Past sessions will appear here after your first booking is completed.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[20px] border border-primary/10 bg-primary-container p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-on-primary-container" />
                <h2 className="text-xl font-bold text-on-primary-container">Need to book your first session?</h2>
              </div>
              <p className="text-sm leading-relaxed text-on-primary-container">
                Browse published listener profiles, compare specialties, and book from the availability they have
                already opened.
              </p>
              <div className="mt-5">
                <Link
                  href="/explore"
                  className="inline-flex rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
                >
                  Explore listeners
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
