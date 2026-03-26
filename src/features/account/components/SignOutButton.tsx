"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SignOutButtonProps = {
  variant?: "solid" | "ghost";
  redirectTo?: string;
};

export default function SignOutButton({
  variant = "solid",
  redirectTo = "/auth?mode=signin&role=talk",
}: SignOutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={
        variant === "ghost"
          ? "inline-flex items-center justify-center text-sm text-on-surface/70 transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex items-center justify-center rounded-sm bg-on-surface px-5 py-3 text-sm font-bold text-surface transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}
