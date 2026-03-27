import Link from "next/link";
import { ChevronRight, MessageSquareText, NotebookPen, Radio, Settings2 } from "lucide-react";
import BrowserNotificationCard from "@/components/shared/BrowserNotificationCard";
import { getAccountEditorData } from "@/server/account/service";
import { getDefaultListenerSettings, isListenerActiveNow, LISTENER_AWAY_TIMEOUT_MINUTES } from "@/server/availability/service";
import { requireUser } from "@/server/auth/server";
import { getListenerDashboardData } from "@/server/sessions/service";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function ListenerDashboardPage() {
  const user = await requireUser(["LISTENER"]);
  const [dashboard, account] = await Promise.all([getListenerDashboardData(user.id), getAccountEditorData(user.id)]);
  const settings = dashboard.settings ?? getDefaultListenerSettings();
  const isPublished = Boolean(dashboard.profile?.isPublished);
  const hasProfile = Boolean(dashboard.profile);
  const isListedInExplore = isPublished;
  const isActiveNow = isListenerActiveNow({
    acceptingNewBookings: settings.acceptingNewBookings,
    lastActiveAt: settings.lastActiveAt,
  });

  if (!account) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Listener dashboard</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{dashboard.name}, your listener workspace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Keep the dashboard small: live status, incoming requests, notification state, and the next actions that
          matter.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Explore listing</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{isListedInExplore ? "Listed" : "Unpublished"}</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {isListedInExplore ? "Users can keep finding your profile in explore." : "Publish your listener profile first."}
          </p>
        </article>
        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Requests</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{settings.acceptingNewBookings ? "On" : "Off"}</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {settings.acceptingNewBookings
              ? "People can send new requests while this stays on."
              : "Turn requests on whenever you want new chats."}
          </p>
        </article>
        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Open chats</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{dashboard.openConversationsCount}</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {dashboard.totalConnectionsCount} accepted conversation{dashboard.totalConnectionsCount === 1 ? "" : "s"} overall
          </p>
        </article>
        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Active now</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{LISTENER_AWAY_TIMEOUT_MINUTES} min</p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {isActiveNow
              ? "You are currently showing the active now badge."
              : "The active now badge clears after a few minutes away, but requests stay on until you turn them off."}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="border border-primary/15 bg-primary-container p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary-container">Workspace</p>
              <h2 className="mt-2 text-2xl font-bold text-on-primary-container">
                {hasProfile ? "Your listener setup is ready to manage." : "Start your public listener listing."}
              </h2>
            </div>
            <Radio className="h-5 w-5 text-on-primary-container" />
          </div>

          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between bg-surface px-3 py-3">
              <span className="text-on-surface-variant">Public URL</span>
              <span className="font-semibold text-on-surface">
                {dashboard.profile?.slug ? `/explore/${dashboard.profile.slug}` : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface px-3 py-3">
              <span className="text-on-surface-variant">Publishing</span>
              <span className="font-semibold text-on-surface">{isPublished ? "Published" : "Draft"}</span>
            </div>
            <div className="flex items-center justify-between bg-surface px-3 py-3">
              <span className="text-on-surface-variant">Requests</span>
              <span className="font-semibold text-on-surface">{settings.acceptingNewBookings ? "On" : "Off"}</span>
            </div>
            <div className="flex items-center justify-between bg-surface px-3 py-3">
              <span className="text-on-surface-variant">Activity</span>
              <span className="font-semibold text-on-surface">{isActiveNow ? "Active now" : "Away"}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/listener/profile"
              className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
            >
              <NotebookPen className="h-4 w-4" />
              Edit profile
            </Link>
            <Link
              href="/listener/availability"
              className="inline-flex items-center justify-center gap-2 border border-on-primary-container/20 px-4 py-3 text-sm font-semibold text-on-primary-container transition hover:bg-white/20"
            >
              <Settings2 className="h-4 w-4" />
              Availability
            </Link>
          </div>
        </article>

        <BrowserNotificationCard
          title="Mobile alerts"
          description="Turn on browser notifications on this device so incoming requests and accepted chats can surface faster on supported mobile browsers."
          initialEnabled={account.browserNotificationsEnabled}
          initialPermission={account.browserNotificationPermission}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Pending requests</h2>
            <Link href="/listener/sessions" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Open chats
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {dashboard.pendingRequests.length ? (
              dashboard.pendingRequests.map((conversation) => (
                <div key={conversation.id} className="border border-on-surface/8 bg-surface px-3 py-3">
                  <p className="font-semibold text-on-surface">{conversation.talkerName}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{conversation.topic || "Support conversation"}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">Sent {formatDateTime(conversation.requestedAt)}</p>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                No pending requests yet.
              </div>
            )}
          </div>
        </article>

        <article className="border border-on-surface/8 bg-surface-container-lowest p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Open conversations</h2>
            <Link href="/listener/sessions" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <MessageSquareText className="h-3.5 w-3.5" />
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {dashboard.openConversations.length ? (
              dashboard.openConversations.map((conversation) => (
                <div key={conversation.id} className="border border-on-surface/8 bg-surface px-3 py-3">
                  <p className="font-semibold text-on-surface">{conversation.talkerName}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{conversation.topic || "Support conversation"}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">Opened {formatDateTime(conversation.openedAt ?? conversation.requestedAt)}</p>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-on-surface/10 bg-surface px-4 py-5 text-sm text-on-surface-variant">
                Chats you have already accepted will appear here.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
