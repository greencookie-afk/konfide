import Link from "next/link";
import { CalendarClock, Clock3, MessageSquareText } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { requireUser } from "@/server/auth/server";
import {
  getSessionConnectionLabel,
  getTalkerSessions,
  isSessionLive,
  isSessionRequestPending,
} from "@/server/sessions/service";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function UserSessionsPage() {
  const user = await requireUser(["TALKER"]);
  const sessions = await getTalkerSessions(user.id);
  const pendingRequests = sessions.filter((session) => isSessionRequestPending(session));
  const activeSessions = sessions.filter((session) => !isSessionRequestPending(session) && isSessionLive(session));
  const history = sessions.filter((session) => !pendingRequests.includes(session) && !activeSessions.includes(session));

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">Sessions</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Your conversations</h1>
          <p className="max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
            Requests, active chats, and older conversations all stay together here so you can pick up where you left
            off.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Requests waiting on listeners</h2>
              </div>
              <div className="space-y-4">
                {pendingRequests.length ? (
                  pendingRequests.map((session) => (
                    <article key={session.id} className="rounded-[16px] border border-on-surface/5 bg-surface p-5">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <h3 className="font-bold text-on-surface">{session.topic || "Support conversation"}</h3>
                        <span className="rounded-[12px] bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container">
                          {getSessionConnectionLabel(session.paymentStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">with {session.counterpartyName}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-on-surface-variant">
                        <span>Sent {formatDateTime(session.createdAt)}</span>
                        <span>{session.durationMinutes} minute chat window</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/sessions/${session.id}`}
                          className="inline-flex rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-on-surface transition hover:opacity-90"
                        >
                          View request
                        </Link>
                        <Link
                          href={`/sessions/${session.id}/chat`}
                          className="inline-flex rounded-[12px] border border-on-surface/10 px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
                        >
                          Open waiting room
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                    No pending requests right now.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <MessageSquareText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Active conversations</h2>
              </div>
              <div className="space-y-4">
                {activeSessions.length ? (
                  activeSessions.map((session) => (
                    <article key={session.id} className="rounded-[16px] bg-surface p-5">
                      <h3 className="font-bold">{session.topic || "Support conversation"}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">{session.counterpartyName}</p>
                      <p className="mt-3 text-sm text-on-surface-variant">
                        Accepted {session.acceptedAt ? formatDateTime(session.acceptedAt) : formatDateTime(session.createdAt)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/sessions/${session.id}/chat`}
                          className="inline-flex rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-on-surface transition hover:opacity-90"
                        >
                          Open chat
                        </Link>
                        <Link
                          href={`/sessions/${session.id}`}
                          className="inline-flex rounded-[12px] border border-on-surface/10 px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
                        >
                          View details
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                    No active conversations yet. Once a listener accepts your request, it will show up here.
                  </div>
                )}
              </div>
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
                      <h3 className="font-bold">{session.topic || "Support conversation"}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">{session.counterpartyName}</p>
                      <p className="mt-3 text-sm text-on-surface-variant">
                        {session.acceptedAt ? `Started ${formatDateTime(session.acceptedAt)}` : formatDateTime(session.createdAt)}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/sessions/${session.id}`}
                          className="inline-flex rounded-[12px] border border-on-surface/10 px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
                        >
                          View details
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface p-5 text-sm text-on-surface-variant">
                    Older conversations will appear here after your first accepted request.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[20px] border border-primary/10 bg-primary-container p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-on-primary-container" />
                <h2 className="text-xl font-bold text-on-primary-container">Need support right now?</h2>
              </div>
              <p className="text-sm leading-relaxed text-on-primary-container">
                Browse listeners who are live right now, open a profile, and send a chat request when you find the
                right fit.
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
