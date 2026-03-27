"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CalendarClock, CheckCheck, Sparkles } from "lucide-react";
import type { NavbarNotification } from "@/server/notifications/service";

type NotificationsMenuProps = {
  notifications: NavbarNotification[];
  storageKey: string;
};

function readSeenIds(storageKey: string) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export default function NotificationsMenu({ notifications, storageKey }: NotificationsMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    setSeenIds(readSeenIds(storageKey));
  }, [storageKey]);

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !seenIds.includes(notification.id)),
    [notifications, seenIds]
  );
  const count = unreadNotifications.length;

  const persistSeenIds = (nextIds: string[]) => {
    setSeenIds(nextIds);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
    }
  };

  const markRead = (notificationId: string) => {
    if (seenIds.includes(notificationId)) {
      return;
    }

    persistSeenIds([...seenIds, notificationId]);
  };

  const markAllRead = () => {
    persistSeenIds([...new Set([...seenIds, ...notifications.map((notification) => notification.id)])]);
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current;

      if (!details?.open) {
        return;
      }

      if (event.target instanceof Node && details.contains(event.target)) {
        return;
      }

      details.open = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      const details = detailsRef.current;

      if (details?.open) {
        details.open = false;
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        aria-label="Notifications"
        className="notif-trigger flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-transparent text-on-surface transition-all duration-200 hover:scale-[1.03] hover:bg-surface-container-low group-open:scale-[1.03] group-open:border-on-surface/5 group-open:bg-surface-container-low [&::-webkit-details-marker]:hidden"
      >
        <span className="relative flex items-center justify-center">
          <Bell className="notif-bell h-5 w-5" />
          {count ? (
            <span className="notif-badge absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-surface shadow-[0_6px_16px_-8px_rgba(255,191,0,0.9)]">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </span>
      </summary>

      <div className="notif-panel absolute right-0 top-[calc(100%+0.75rem)] z-50 w-80 max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-[20px] border border-on-surface/8 bg-surface/95 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="border-b border-on-surface/6 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-on-surface">Notifications</p>
              <p className="mt-1 text-xs text-on-surface-variant">
                {count ? `${count} unread update${count === 1 ? "" : "s"}` : "Everything is read"}
              </p>
            </div>
            {notifications.length ? (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 rounded-full border border-on-surface/8 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant transition hover:border-primary/20 hover:text-on-surface"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            ) : null}
          </div>
        </div>

        {notifications.length ? (
          <div className="max-h-[24rem] space-y-2 overflow-y-auto p-2">
            {notifications.map((notification, index) => {
              const isAction = notification.tone === "action";
              const isUnread = !seenIds.includes(notification.id);

              return (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => {
                    markRead(notification.id);

                    if (detailsRef.current) {
                      detailsRef.current.open = false;
                    }
                  }}
                  className={`notif-card block rounded-[16px] border px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-surface-container-lowest ${
                    isUnread
                      ? "border-primary/10 bg-surface-container-low/80"
                      : "border-transparent bg-surface-container-low/45"
                  }`}
                  style={{ animationDelay: `${80 + index * 55}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${
                        isAction ? "bg-primary-container text-on-primary-container" : "bg-surface text-primary"
                      }`}
                    >
                      {isAction ? <Sparkles className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold leading-5 text-on-surface">{notification.title}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                            isAction
                              ? "bg-primary/10 text-primary"
                              : "bg-green-500/10 text-green-700"
                          }`}
                        >
                          {isAction ? "Action" : "Session"}
                        </span>
                        {isUnread ? <span className="notif-pill shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface">New</span> : null}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-on-surface-variant">{notification.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-[16px] border border-dashed border-on-surface/10 bg-surface-container-low px-4 py-5 text-sm leading-6 text-on-surface-variant">
              Nothing new here yet. Live requests, accepted chats, and listener setup reminders will appear here automatically.
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
