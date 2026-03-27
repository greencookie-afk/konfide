"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, Mail, UserRound } from "lucide-react";
import BrowserNotificationCard from "@/components/shared/BrowserNotificationCard";
import SignOutButton from "@/features/account/components/SignOutButton";
import type { AccountEditorData } from "@/server/account/service";

type AccountProfileEditorProps = {
  initialData: AccountEditorData;
};

export default function AccountProfileEditor({ initialData }: AccountProfileEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const userInitial = (name || initialData.email || "K").charAt(0).toUpperCase();

  const handleSave = () => {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/account", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not save your profile.");
          return;
        }

        setMessage("Profile updated.");
        router.refresh();
      } catch {
        setError("We could not save your profile.");
      }
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
      <section className="border border-on-surface/8 bg-surface-container-lowest p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-surface-container-highest ring-1 ring-on-surface/5">
              {initialData.avatarUrl ? (
                <Image
                  src={initialData.avatarUrl}
                  alt={initialData.name ? `${initialData.name} avatar` : "User avatar"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-on-surface">{userInitial}</span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">User profile</p>
              <h2 className="mt-2 text-xl font-bold text-on-surface">{name || "Konfide member"}</h2>
              <p className="text-sm text-on-surface-variant">{initialData.email}</p>
            </div>
          </div>

          <div className="shrink-0">
            <SignOutButton />
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Display name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full border border-on-surface/10 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-on-surface/8 bg-surface px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{initialData.email}</p>
            </div>

            <div className="border border-on-surface/8 bg-surface px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                <UserRound className="h-4 w-4 text-primary" />
                Role
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">
                {initialData.role === "LISTENER" ? "Listener account" : "Talker account"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Save profile
          </button>

          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </section>

      <BrowserNotificationCard
        description="Ask for browser permission once, then keep alerts enabled on this account so request and chat updates can surface cleanly on supported mobile browsers."
        initialEnabled={initialData.browserNotificationsEnabled}
        initialPermission={initialData.browserNotificationPermission}
      />
    </div>
  );
}
