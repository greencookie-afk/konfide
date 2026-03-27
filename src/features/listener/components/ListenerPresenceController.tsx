"use client";

import { useEffect, useState } from "react";

const HEARTBEAT_INTERVAL_MS = 60_000;

function broadcastAvailability(acceptingNewBookings: boolean) {
  window.dispatchEvent(
    new CustomEvent("listener-availability-changed", {
      detail: {
        acceptingNewBookings,
      },
    })
  );
}

function sendAwayBeacon() {
  if (typeof navigator === "undefined") {
    return;
  }

  const payload = JSON.stringify({
    action: "away",
  });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/listener/presence", new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch("/api/listener/presence", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}

async function postHeartbeat() {
  await fetch("/api/listener/presence", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "heartbeat",
    }),
    keepalive: true,
  });
}

type ListenerPresenceControllerProps = {
  initialAcceptingNewBookings: boolean;
};

export default function ListenerPresenceController({
  initialAcceptingNewBookings,
}: ListenerPresenceControllerProps) {
  const [isAvailable, setIsAvailable] = useState(initialAcceptingNewBookings);

  useEffect(() => {
    const handleAvailabilityChange = (event: Event) => {
      const nextValue =
        event instanceof CustomEvent && typeof event.detail?.acceptingNewBookings === "boolean"
          ? event.detail.acceptingNewBookings
          : false;

      setIsAvailable(nextValue);
    };

    window.addEventListener("listener-availability-changed", handleAvailabilityChange);

    return () => {
      window.removeEventListener("listener-availability-changed", handleAvailabilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isAvailable || document.visibilityState !== "visible") {
      return;
    }

    void postHeartbeat();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void postHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAvailable]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isAvailable) {
        return;
      }

      if (document.visibilityState === "hidden") {
        sendAwayBeacon();
        setIsAvailable(false);
        broadcastAvailability(false);
        return;
      }

      void postHeartbeat();
    };

    const handlePageHide = () => {
      if (!isAvailable) {
        return;
      }

      sendAwayBeacon();
      setIsAvailable(false);
      broadcastAvailability(false);
    };

    const handleFocus = () => {
      if (isAvailable) {
        void postHeartbeat();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAvailable]);

  return null;
}
