import Link from "next/link";
import { CalendarClock, MessageSquareMore, TimerReset, UserRound } from "lucide-react";
import type { SessionChatState } from "@/server/chat/service";
import {
  getSessionTimingSnapshot,
  isSessionRequestPending,
  type SessionDetail,
} from "@/server/sessions/service";
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
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default function SessionChatView({
  session,
  viewerRole,
  basePath,
  currentUserId,
  initialChatState,
}: SessionChatViewProps) {
  const timing = getSessionTimingSnapshot(session);
  const counterparty = viewerRole === "TALKER" ? session.listener : session.talker;
  const isPending = isSessionRequestPending(session);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="rounded-[24px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Chat</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          {isPending ? "Waiting for acceptance" : timing.isJoinWindowOpen ? "Chat is open" : "Chat has ended"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          This chat stays attached to the live request, so both people keep the same context before and after the
          conversation starts.
        </p>

        <div className="mt-6 rounded-[18px] border border-primary/10 bg-primary-container px-4 py-4">
          <div className="flex items-start gap-3">
            <TimerReset className="mt-0.5 h-5 w-5 text-on-primary-container" />
            <div>
              <p className="font-semibold text-on-primary-container">
                {isPending
                  ? viewerRole === "LISTENER"
                    ? "Accept the request to open chat."
                    : "The listener still needs to accept."
                  : timing.isJoinWindowOpen
                    ? "The chat window is live."
                    : "The live chat window has closed."}
              </p>
              <p className="mt-1 text-sm leading-6 text-on-primary-container/80">
                {isPending
                  ? "Once accepted, both sides can message immediately from this page."
                  : timing.isJoinWindowOpen
                    ? "Stay here and keep the conversation in one shared place."
                    : `This conversation started ${formatDateTime(session.scheduledAt)} and closed around ${formatTime(
                        timing.endsAt
                      )}.`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">With</p>
            <p className="mt-2 text-lg font-bold text-on-surface">{counterparty.name}</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {viewerRole === "TALKER" ? session.listener.headline : session.talker.email}
            </p>
          </div>
          <div className="rounded-[16px] bg-surface px-4 py-4">
            <p className="text-sm text-on-surface-variant">Topic</p>
            <p className="mt-2 text-lg font-bold text-on-surface">{session.topic || "Support conversation"}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{session.durationMinutes} minute chat window</p>
          </div>
        </div>

        <div className="mt-6 rounded-[18px] border border-on-surface/5 bg-surface px-4 py-4">
          <div className="flex items-start gap-3">
            <MessageSquareMore className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-on-surface">Request notes</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                {session.notes?.trim() || "No extra context was added to this request."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SessionChatRoom sessionId={session.id} currentUserId={currentUserId} initialState={initialChatState} />
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[24px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-on-surface">Room access</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                The listener controls when the request becomes a live conversation. After acceptance, the chat opens
                immediately and stays available during the live chat window.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-on-surface">Next steps</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                {isPending
                  ? viewerRole === "LISTENER"
                    ? "Accept the request when you are ready to chat."
                    : "Stay here or return later. This page will start working as soon as the listener accepts."
                  : timing.isJoinWindowOpen
                    ? "Keep the conversation in this shared room while you are connected."
                    : "The room is now read-only, but the request details and chat history stay here."}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {viewerRole === "LISTENER" && isPending ? <AcceptSessionButton sessionId={session.id} /> : null}
            <Link
              href={basePath}
              className="inline-flex items-center justify-center rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
            >
              Back to request details
            </Link>
          </div>
        </section>
      </aside>
    </div>
  );
}
