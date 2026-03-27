"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
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
    <div className="space-y-4">
      <div className="rounded-[18px] border border-primary/10 bg-primary-container px-4 py-4 text-sm leading-6 text-on-primary-container">
        {accessMessage}
      </div>

      <div className="rounded-[20px] border border-on-surface/5 bg-surface px-4 py-4">
        <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
          {messages.length ? (
            messages.map((message) => {
              const isOwnMessage = message.sender.id === currentUserId;

              return (
                <article
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  {!isOwnMessage ? (
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-surface-container-highest">
                      {message.sender.avatarUrl ? (
                        <Image
                          src={message.sender.avatarUrl}
                          alt={`${message.sender.name} avatar`}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-on-surface">
                          {message.sender.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div
                    className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm shadow-sm ${
                      isOwnMessage
                        ? "bg-primary text-on-surface"
                        : "border border-on-surface/5 bg-surface-container-lowest text-on-surface"
                    }`}
                  >
                    <p className={`font-semibold ${isOwnMessage ? "text-on-surface" : "text-on-surface"}`}>
                      {isOwnMessage ? "You" : message.sender.name}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap leading-6">{message.body}</p>
                    <p className={`mt-2 text-[11px] ${isOwnMessage ? "text-on-surface/70" : "text-on-surface-variant"}`}>
                      {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface-container-low px-4 py-5 text-sm text-on-surface-variant">
              No messages yet. Once the listener accepts and the chat opens, the conversation will appear here.
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!canSend || isPending}
          rows={4}
          placeholder={canSend ? "Write a message…" : accessMessage}
          className="w-full rounded-[16px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-3">
          {error ? <p className="text-sm text-red-700">{error}</p> : <div />}
          <button
            type="submit"
            disabled={!canSend || isPending}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
