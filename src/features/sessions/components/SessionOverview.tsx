import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, MessageSquareMore, NotebookText, UserRound } from "lucide-react";
import AcceptSessionButton from "@/features/sessions/components/AcceptSessionButton";
import { getSessionConnectionLabel, isSessionRequestPending, type SessionDetail } from "@/server/sessions/service";

type SessionOverviewProps = {
  session: SessionDetail;
  viewerRole: "TALKER" | "LISTENER";
  basePath: string;
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default function SessionOverview({ session, viewerRole, basePath }: SessionOverviewProps) {
  const counterparty = viewerRole === "TALKER" ? session.listener : session.talker;
  const counterpartySubtitle = viewerRole === "TALKER" ? session.listener.headline : session.talker.email;
  const isPending = isSessionRequestPending(session);
  const connectionLabel = getSessionConnectionLabel(session.paymentStatus);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[24px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {viewerRole === "TALKER" ? "Conversation request" : "Incoming request"}
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
              {session.topic || "Support conversation"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
              {viewerRole === "TALKER"
                ? `You reached out to ${counterparty.name}.`
                : `${counterparty.name} wants to connect with you.`}
            </p>
          </div>
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container">
            {connectionLabel}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">Requested</p>
            <p className="mt-2 text-base font-bold text-on-surface">{formatDateTime(session.createdAt)}</p>
          </div>
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">Chat status</p>
            <p className="mt-2 text-base font-bold text-on-surface">{connectionLabel}</p>
          </div>
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">Chat history</p>
            <p className="mt-2 text-base font-bold text-on-surface">Stays in this room</p>
          </div>
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">Accepted</p>
            <p className="mt-2 text-base font-bold text-on-surface">
              {session.acceptedAt ? formatDateTime(session.acceptedAt) : "Not yet"}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[18px] border border-primary/10 bg-primary-container px-4 py-4">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 text-on-primary-container" />
            <div>
              <p className="font-semibold text-on-primary-container">
                {isPending
                  ? viewerRole === "LISTENER"
                    ? "Accept this request to start the chat."
                    : "Waiting for the listener to accept."
                  : "The chat is open and stays available."}
              </p>
              <p className="mt-1 text-sm leading-6 text-on-primary-container/80">
                {isPending
                  ? "Nothing else is required before the conversation can begin."
                  : "Once accepted, both sides keep the same chat room and the full history remains there."}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex items-center gap-3">
            <NotebookText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-on-surface">Context</h2>
          </div>
          <div className="mt-4 rounded-[18px] border border-on-surface/5 bg-surface px-4 py-4 text-sm leading-6 text-on-surface-variant">
            {session.notes?.trim() || "No extra context was added to this request."}
          </div>
        </section>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[24px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-primary-container">Session actions</p>
          <div className="mt-5 grid gap-3">
            {viewerRole === "LISTENER" && isPending ? <AcceptSessionButton sessionId={session.id} /> : null}
            <Link
              href={`${basePath}/chat`}
              className="inline-flex items-center justify-between gap-3 rounded-[16px] bg-surface px-4 py-4 text-sm font-semibold text-on-surface transition hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquareMore className="h-4 w-4 text-primary" />
                {isPending ? "Open waiting room" : "Open chat"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-[24px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-[16px] bg-surface-container-highest">
              {counterparty.avatarUrl ? (
                <Image
                  src={counterparty.avatarUrl}
                  alt={`${counterparty.name} avatar`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-on-surface">
                  {counterparty.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-on-surface">{counterparty.name}</p>
              <p className="text-sm text-on-surface-variant">{counterpartySubtitle}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-on-surface-variant">
            <div className="flex items-start gap-3 rounded-[16px] bg-surface px-4 py-4">
              <UserRound className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold text-on-surface">Current state</p>
                <p className="mt-1">
                  {isPending
                    ? "The request is waiting for the listener to accept."
                    : "The conversation is active and both sides can use the shared chat."}
                </p>
              </div>
            </div>
            {viewerRole === "TALKER" && session.listener.slug ? (
              <Link
                href={`/explore/${session.listener.slug}`}
                className="inline-flex w-full items-center justify-between rounded-[16px] border border-on-surface/5 px-4 py-4 text-sm font-semibold text-on-surface transition hover:bg-surface"
              >
                Back to listener profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </section>
      </aside>
    </div>
  );
}
