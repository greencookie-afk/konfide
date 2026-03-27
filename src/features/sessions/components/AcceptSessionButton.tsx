"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";

type AcceptSessionButtonProps = {
  sessionId: string;
  label?: string;
  className?: string;
  redirectTo?: string;
};

export default function AcceptSessionButton({
  sessionId,
  label = "Accept request",
  className = "inline-flex items-center justify-center gap-2 rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
  redirectTo,
}: AcceptSessionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/accept`, {
          method: "POST",
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error || "We could not accept this request.");
          return;
        }

        if (redirectTo) {
          router.push(redirectTo);
          router.refresh();
          return;
        }

        router.refresh();
      } catch {
        setError("We could not accept this request.");
      }
    });
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleAccept} disabled={isPending} className={className}>
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {label}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
