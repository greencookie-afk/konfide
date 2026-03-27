import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import type { SessionChatState } from "@/server/chat/service";
import { isSessionRequestPending, type SessionDetail } from "@/server/sessions/service";
import AcceptSessionButton from "@/features/sessions/components/AcceptSessionButton";
import SessionChatRoom from "@/features/sessions/components/SessionChatRoom";

type SessionChatViewProps = {
  session: SessionDetail;
  viewerRole: "TALKER" | "LISTENER";
  basePath: string;
  currentUserId: string;
  initialChatState: SessionChatState;
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(value);
}

function getSessionLabel(session: SessionDetail) {
  if (session.paymentStatus === "FAILED") {
    return "Declined";
  }

  if (session.paymentStatus === "REFUNDED") {
    return "Closed";
  }

  if (isSessionRequestPending(session)) {
    return "Pending";
  }

  return "Open";
}

export default function SessionChatView({
  session,
  viewerRole,
  basePath,
  currentUserId,
  initialChatState,
}: SessionChatViewProps) {
  const counterparty = viewerRole === "TALKER" ? session.listener : session.talker;
  const isPending = isSessionRequestPending(session);
  const sessionLabel = getSessionLabel(session);
  const chatHref = `${basePath}/${session.id}/chat`;
  const subtitle = isPending
    ? viewerRole === "LISTENER"
      ? "Accept to unlock the chat."
      : "Waiting for acceptance."
    : `${sessionLabel} · ${formatDateTime(session.acceptedAt ?? session.scheduledAt)}`;

  return (
    <div className="overflow-hidden border border-on-surface/8 bg-surface-container-lowest">
      <header className="border-b border-on-surface/8 bg-surface px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={basePath}
            className="inline-flex h-8 w-8 items-center justify-center border border-on-surface/10 bg-surface-container-lowest text-on-surface"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-surface-container-highest">
            {counterparty.avatarUrl ? (
              <Image
                src={counterparty.avatarUrl}
                alt={`${counterparty.name} avatar`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-on-surface">
                {counterparty.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-on-surface sm:text-base">{counterparty.name}</h1>
            <p className="truncate text-[12px] text-on-surface-variant">
              {session.topic || session.listener.headline || session.talker.email || subtitle}
            </p>
          </div>

          <span className="bg-surface-container px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface">
            {sessionLabel}
          </span>

          {viewerRole === "LISTENER" && isPending ? (
            <div className="hidden sm:block">
              <AcceptSessionButton
                sessionId={session.id}
                redirectTo={chatHref}
                label="Accept"
                className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2 text-xs font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
          <span>{subtitle}</span>
        </div>

        {session.notes?.trim() ? (
          <p className="mt-3 border-t border-on-surface/8 pt-3 text-sm leading-5 text-on-surface-variant">
            {session.notes.trim()}
          </p>
        ) : null}

        {viewerRole === "LISTENER" && isPending ? (
          <div className="mt-3 sm:hidden">
            <AcceptSessionButton
              sessionId={session.id}
              redirectTo={chatHref}
              label="Accept"
              className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2 text-xs font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        ) : null}
      </header>

      <SessionChatRoom sessionId={session.id} currentUserId={currentUserId} initialState={initialChatState} />
    </div>
  );
}
