"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { LoaderCircle, MessageSquareMore, Sparkles } from "lucide-react";

type ConversationRequestFormProps = {
  canSendRequest: boolean;
  listener: {
    slug: string;
    name: string;
    avatarUrl: string | null;
    headline: string;
    specialties: string[];
    languages: string[];
    isAcceptingRequests: boolean;
    isActiveNow: boolean;
  };
};

export default function ConversationRequestForm({
  canSendRequest,
  listener,
}: ConversationRequestFormProps) {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!canSendRequest) {
      setError("Sign in with a talker account before sending a request.");
      return;
    }

    if (!listener.isAcceptingRequests) {
      setError("This listener has requests turned off right now.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listenerSlug: listener.slug,
            topic,
            notes,
          }),
        });
        const payload = (await response.json()) as {
          error?: string;
          requestId?: string;
          sessionId?: string;
        };
        const conversationId = payload.requestId ?? payload.sessionId;

        if (!response.ok) {
          setError(payload.error || "We could not send your request.");
          return;
        }

        if (!conversationId) {
          setError("Your request was sent, but we could not open the conversation page.");
          return;
        }

        window.location.assign(`/sessions/${conversationId}`);
      } catch {
        setError("We could not send your request right now.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
          <span className="text-primary">1. Share your topic</span>
          <span>2. Add context</span>
          <span>3. Send request</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface">What do you want support with?</label>
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Stress, grief, burnout, relationships..."
              className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface">Anything the listener should know before accepting?</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Share a little context so they know how to meet you."
              rows={7}
              className="w-full rounded-[14px] border border-on-surface/5 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        <div className="mt-6 rounded-[16px] border border-primary/10 bg-primary-container/35 px-4 py-4 text-sm text-on-primary-container">
          Once the listener accepts, the chat opens immediately for both of you in the same permanent conversation.
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-[16px] bg-surface-container-highest">
              {listener.avatarUrl ? (
                <Image src={listener.avatarUrl} alt={`${listener.name} portrait`} fill sizes="56px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-on-surface">
                  {listener.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-on-primary-container">{listener.name}</p>
              <p className="text-sm text-on-primary-container/75">{listener.headline}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-[16px] bg-surface px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Status</span>
              <span className="font-semibold text-on-surface">
                {listener.isActiveNow ? "Active now" : listener.isAcceptingRequests ? "Requests on" : "Requests off"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-on-surface-variant">Top topics</span>
              <span className="text-right font-semibold text-on-surface">
                {listener.specialties.slice(0, 3).join(", ") || "Open support"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-on-surface-variant">Languages</span>
              <span className="text-right font-semibold text-on-surface">
                {listener.languages.join(", ") || "Not listed"}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] border border-on-surface/5 bg-surface px-4 py-4 text-sm">
            <p className="font-semibold text-on-surface">Topic preview</p>
            <p className="mt-2 text-on-surface-variant">
              {topic.trim() || "Add a short topic so the listener knows what kind of support you need."}
            </p>
            <p className="mt-4 font-semibold text-on-surface">Context preview</p>
            <p className="mt-2 line-clamp-5 text-on-surface-variant">
              {notes.trim() || "Your extra context will appear here before you send the request."}
            </p>
          </div>

          {error ? (
            <p className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || !canSendRequest || !listener.isAcceptingRequests}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {canSendRequest ? "Send conversation request" : "Preview only"}
          </button>
        </section>

        <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <MessageSquareMore className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-on-surface">How this works</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                Requests stay lightweight. You share your topic, the listener accepts when ready, and the conversation
                continues in the same chat space.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-on-surface">No scheduling friction</p>
              <p className="text-sm leading-6 text-on-surface-variant">
                If requests are on, you can send one now even when the listener is briefly away from the site.
              </p>
            </div>
          </div>
        </section>
      </aside>
    </form>
  );
}
