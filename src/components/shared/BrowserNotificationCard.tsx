"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, LoaderCircle } from "lucide-react";

type BrowserNotificationCardProps = {
  title?: string;
  description: string;
  initialEnabled: boolean;
  initialPermission: string | null;
};

type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";

export default function BrowserNotificationCard({
  title = "Browser notifications",
  description,
  initialEnabled,
  initialPermission,
}: BrowserNotificationCardProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [permission, setPermission] = useState<NotificationPermissionState>(
    (initialPermission as NotificationPermissionState | null) ?? "default"
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      setEnabled(false);
      return;
    }

    setIsSupported(true);
    setPermission(window.Notification.permission);

    if (window.Notification.permission !== "granted") {
      setEnabled(false);
    }
  }, []);

  const savePreference = async (nextEnabled: boolean, nextPermission: NotificationPermissionState) => {
    setIsPending(true);

    try {
      const response = await fetch("/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          browserNotificationsEnabled: nextEnabled,
          browserNotificationPermission: nextPermission === "unsupported" ? null : nextPermission,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "We could not save notification preferences.");
        return false;
      }

      setEnabled(nextEnabled);
      setPermission(nextPermission);
      setError("");
      return true;
    } catch {
      setError("We could not save notification preferences.");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const handleRequestPermission = async () => {
    setMessage("");
    setError("");

    if (!isSupported || typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      setError("This browser does not support web notifications.");
      return;
    }

    setIsPending(true);

    try {
      const nextPermission = await window.Notification.requestPermission();
      const didSave = await savePreference(nextPermission === "granted", nextPermission);

      if (!didSave) {
        return;
      }

      if (nextPermission === "granted") {
        setMessage("Browser notifications are enabled on this device.");
        return;
      }

      setMessage("Permission was not granted. You can enable it later from browser settings.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDisable = async () => {
    setMessage("");
    setError("");

    const didSave = await savePreference(false, permission);

    if (didSave) {
      setMessage("Browser notifications are paused for this account.");
    }
  };

  const statusLabel =
    permission === "unsupported"
      ? "Unsupported"
      : permission === "granted"
        ? enabled
          ? "On"
          : "Permission granted, paused"
        : permission === "denied"
          ? "Blocked in browser"
          : "Permission not requested";

  return (
    <section className="border border-on-surface/8 bg-surface-container-lowest p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Notifications</p>
          <h3 className="mt-2 text-lg font-bold text-on-surface">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{description}</p>
        </div>
        <span className="bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {permission === "granted" && enabled ? (
          <button
            type="button"
            onClick={handleDisable}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 border border-on-surface/10 bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <BellOff className="h-3.5 w-3.5" />}
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRequestPermission}
            disabled={isPending || permission === "unsupported"}
            className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
            Turn on
          </button>
        )}
      </div>

      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
