import Link from "next/link";
import { CalendarDays, Settings2 } from "lucide-react";
import AcceptSessionButton from "@/features/sessions/components/AcceptSessionButton";
import { requireUser } from "@/server/auth/server";
import {
  getSessionConnectionLabel,
  getListenerSessions,
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

export default async function ListenerSessionsPage() {
  const user = await requireUser(["LISTENER"]);
  const sessions = await getListenerSessions(user.id);
  const incomingRequests = sessions.filter((session) => isSessionRequestPending(session));
  const activeSessions = sessions.filter((session) => !isSessionRequestPending(session) && isSessionLive(session));
  const history = sessions.filter((session) => !incomingRequests.includes(session) && !activeSessions.includes(session));

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Sessions</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Manage live chat requests</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          New requests arrive here automatically whenever your profile is published and your availability is turned on.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Incoming requests</h2>
          </div>
          <div className="mt-5 space-y-3">
            {incomingRequests.length ? (
              incomingRequests.map((session) => (
                <article key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-on-surface">{session.counterpartyName}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{session.topic || "Support conversation"}</p>
                    </div>
                    <span className="rounded-[12px] bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container">
                      {getSessionConnectionLabel(session.paymentStatus)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-on-surface-variant">Sent {formatDateTime(session.createdAt)}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <AcceptSessionButton
                      sessionId={session.id}
                      className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <Link
                      href={`/listener/sessions/${session.id}`}
                      className="inline-flex rounded-[12px] border border-on-surface/10 px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
                    >
                      View request
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                No incoming requests yet. Turn on your availability button when you are ready to appear in browse.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-on-primary-container">Control your visibility</h2>
            <p className="mt-3 text-sm leading-6 text-on-primary-container/80">
              One availability switch controls whether new people can find you. Turn it off any time you need to step
              away.
            </p>
            <div className="mt-5">
              <Link
                href="/listener/availability"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
              >
                <Settings2 className="h-4 w-4" />
                Manage availability
              </Link>
            </div>
          </section>

          <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-on-surface">Active conversations</h2>
            <div className="mt-5 space-y-3">
              {activeSessions.length ? (
                activeSessions.map((session) => (
                  <article key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                    <p className="font-semibold text-on-surface">{session.counterpartyName}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{session.topic || "Support conversation"}</p>
                    <p className="mt-3 text-sm text-on-surface-variant">
                      Started {session.acceptedAt ? formatDateTime(session.acceptedAt) : formatDateTime(session.createdAt)}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/listener/sessions/${session.id}/chat`}
                        className="inline-flex rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-on-surface transition hover:opacity-90"
                      >
                        Open chat
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                  Accepted conversations will appear here.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-on-surface">Recent history</h2>
            <div className="mt-5 space-y-3">
              {history.length ? (
                history.map((session) => (
                  <article key={session.id} className="rounded-[16px] bg-surface px-4 py-4">
                    <p className="font-semibold text-on-surface">{session.counterpartyName}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{session.topic || "Support conversation"}</p>
                    <p className="mt-3 text-sm text-on-surface-variant">
                      {session.acceptedAt ? `Started ${formatDateTime(session.acceptedAt)}` : formatDateTime(session.createdAt)}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/listener/sessions/${session.id}`}
                        className="inline-flex rounded-[12px] border border-on-surface/10 px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
                      >
                        View details
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                  Older conversations will appear here once requests start getting accepted.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
