import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import type { SessionPaymentStatus } from "@/generated/prisma";
import AcceptSessionButton from "@/features/sessions/components/AcceptSessionButton";
import { getSessionTimingSnapshot, type SessionCard } from "@/server/sessions/service";

type SessionInboxProps = {
  sessions: SessionCard[];
  viewerRole: "TALKER" | "LISTENER";
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function buildChatHref(viewerRole: "TALKER" | "LISTENER", sessionId: string) {
  return viewerRole === "LISTENER" ? `/listener/sessions/${sessionId}/chat` : `/sessions/${sessionId}/chat`;
}

function getSessionState(session: SessionCard) {
  if (session.paymentStatus === "FAILED") {
    return {
      label: "Declined",
      tone: "muted" as const,
      meta: "The request was declined.",
    };
  }

  if (session.paymentStatus === "REFUNDED") {
    return {
      label: "Closed",
      tone: "muted" as const,
      meta: "This conversation is closed.",
    };
  }

  if (session.paymentStatus !== "PAID") {
    return {
      label: "Pending",
      tone: "pending" as const,
      meta: `Requested ${formatDateTime(session.createdAt)}`,
    };
  }

  const timing = getSessionTimingSnapshot(session);

  if (timing.isJoinWindowOpen) {
    return {
      label: "Live",
      tone: "live" as const,
      meta: `Started ${formatDateTime(session.acceptedAt ?? session.scheduledAt)}`,
    };
  }

  if (timing.endsAt <= new Date()) {
    return {
      label: "Ended",
      tone: "muted" as const,
      meta: `Ended ${formatDateTime(timing.endsAt)}`,
    };
  }

  return {
    label: "Accepted",
    tone: "connected" as const,
    meta: `Accepted ${formatDateTime(session.acceptedAt ?? session.scheduledAt)}`,
  };
}

function getStatusClass(tone: "pending" | "live" | "connected" | "muted", paymentStatus: SessionPaymentStatus) {
  if (tone === "live") {
    return "bg-green-600 text-white";
  }

  if (tone === "connected") {
    return "bg-primary-container text-on-primary-container";
  }

  if (paymentStatus === "FAILED") {
    return "bg-red-50 text-red-700";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function SessionInbox({
  sessions,
  viewerRole,
  title,
  description,
  actionHref,
  actionLabel,
}: SessionInboxProps) {
  const rows = sessions.map((session) => ({
    session,
    state: getSessionState(session),
    chatHref: buildChatHref(viewerRole, session.id),
  }));
  const pendingCount = rows.filter((row) => row.state.label === "Pending").length;
  const liveCount = rows.filter((row) => row.state.label === "Live").length;
  const historyCount = rows.length - pendingCount - liveCount;

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 border border-on-surface/8 bg-surface-container-lowest p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Chats</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{description}</p>
        </div>
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center gap-2 border border-on-surface/10 bg-surface px-4 py-3 text-sm font-semibold text-on-surface"
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        <div className="border border-on-surface/8 bg-surface-container-lowest px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">Pending</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{pendingCount}</p>
        </div>
        <div className="border border-on-surface/8 bg-surface-container-lowest px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">Live</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{liveCount}</p>
        </div>
        <div className="border border-on-surface/8 bg-surface-container-lowest px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">History</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{historyCount}</p>
        </div>
      </section>

      <section className="border border-on-surface/8 bg-surface-container-lowest">
        {rows.length ? (
          rows.map(({ session, state, chatHref }, index) => (
            <article
              key={session.id}
              className={`px-3 py-3 sm:px-4 ${index === 0 ? "" : "border-t border-on-surface/8"}`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-surface-container-highest">
                    {session.counterpartyAvatarUrl ? (
                      <Image
                        src={session.counterpartyAvatarUrl}
                        alt={`${session.counterpartyName} avatar`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-on-surface">
                        {session.counterpartyName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-semibold text-on-surface sm:text-base">
                        {session.counterpartyName}
                      </h2>
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${getStatusClass(
                          state.tone,
                          session.paymentStatus
                        )}`}
                      >
                        {state.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface">{session.topic || "Support conversation"}</p>
                    <p className="mt-1 text-[12px] text-on-surface-variant">
                      {state.meta} · {session.durationMinutes} min
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {viewerRole === "LISTENER" && state.label === "Pending" ? (
                    <AcceptSessionButton
                      sessionId={session.id}
                      redirectTo={chatHref}
                      label="Accept"
                      className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2 text-xs font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  ) : null}
                  <Link
                    href={chatHref}
                    className="inline-flex items-center justify-center gap-2 border border-on-surface/10 bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface"
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Open chat
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="px-4 py-10 text-sm text-on-surface-variant">
            No chats yet. Requests and conversation history will appear here as soon as they start.
          </div>
        )}
      </section>
    </div>
  );
}
