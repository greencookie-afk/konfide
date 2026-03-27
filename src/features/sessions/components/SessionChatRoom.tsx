"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import type { SessionChatState, SessionChatMessageView } from "@/server/chat/service";

type SessionChatRoomProps = {
  sessionId: string;
  currentUserId: string;
  initialState: SessionChatState;
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function SessionChatRoom({ sessionId, currentUserId, initialState }: SessionChatRoomProps) {
  const [messages, setMessages] = useState<SessionChatMessageView[]>(initialState.messages);
  const [canSend, setCanSend] = useState(initialState.canSend);
  const [accessMessage, setAccessMessage] = useState(initialState.accessMessage);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/messages`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SessionChatState;

        if (!isMounted) {
          return;
        }

        setMessages(payload.messages);
        setCanSend(payload.canSend);
        setAccessMessage(payload.accessMessage);
      } catch {
        // Keep the last good state if polling fails temporarily.
      }
    };

    const intervalId = window.setInterval(refresh, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end",
    });
  }, [messages.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!draft.trim()) {
      setError("Write a message before sending.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: draft,
          }),
        });
        const payload = (await response.json()) as {
          error?: string;
          message?: SessionChatMessageView;
          accessMessage?: string;
        };

        if (!response.ok || !payload.message) {
          setError(payload.error || "We could not send that message.");
          return;
        }

        setMessages((current) => [...current, payload.message as SessionChatMessageView]);
        setAccessMessage(payload.accessMessage || accessMessage);
        setDraft("");
      } catch {
        setError("We could not send that message.");
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100svh-11rem)] flex-col bg-surface-container-lowest">
      <div
        className={`border-b px-3 py-2 text-[12px] leading-5 sm:px-4 ${
          canSend ? "border-green-600/20 bg-green-50 text-green-700" : "border-on-surface/8 bg-surface text-on-surface-variant"
        }`}
      >
        {accessMessage}
      </div>

      <div className="flex-1 overflow-y-auto bg-surface-container-low px-3 py-3 sm:px-4">
        {messages.length ? (
          <div className="space-y-2">
            {messages.map((message) => {
              const isOwnMessage = message.sender.id === currentUserId;

              return (
                <article key={message.id} className={`flex gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  {!isOwnMessage ? (
                    <div className="relative h-8 w-8 overflow-hidden bg-surface-container-highest">
                      {message.sender.avatarUrl ? (
                        <Image
                          src={message.sender.avatarUrl}
                          alt={`${message.sender.name} avatar`}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-on-surface">
                          {message.sender.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div
                    className={`max-w-[85%] border px-3 py-2 text-[13px] ${
                      isOwnMessage
                        ? "border-primary bg-primary text-on-surface"
                        : "border-on-surface/8 bg-surface text-on-surface"
                    }`}
                  >
                    <p className="font-semibold">{isOwnMessage ? "You" : message.sender.name}</p>
                    <p className="mt-1 whitespace-pre-wrap leading-5">{message.body}</p>
                    <p className={`mt-2 text-[10px] ${isOwnMessage ? "text-on-surface/70" : "text-on-surface-variant"}`}>
                      {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                </article>
              );
            })}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
            No messages yet. This chat history will stay here once the request is accepted.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-on-surface/8 bg-surface px-3 py-3 sm:px-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!canSend || isPending}
          rows={2}
          placeholder={canSend ? "Write a message" : "Typing unlocks after acceptance"}
          className="min-h-20 w-full resize-none border border-on-surface/10 bg-surface-container-lowest px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          {error ? (
            <p className="text-[12px] text-red-700">{error}</p>
          ) : (
            <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              {canSend ? "Open" : "Locked"}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSend || isPending}
            className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
