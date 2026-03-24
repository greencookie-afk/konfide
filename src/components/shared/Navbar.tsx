"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: "TALKER" | "LISTENER" | "ADMIN";
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const linkClass = (href: string) =>
    pathname === href
      ? "text-on-surface border-b-2 border-primary pb-1 text-lg tracking-tight"
      : "text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight";

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          if (!cancelled) {
            setUser(null);
          }
          return;
        }

        const payload = (await response.json()) as { user: SessionUser | null };

        if (!cancelled) {
          setUser(payload.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const primaryHref =
    isLoadingSession
      ? null
      : user?.role === "LISTENER"
      ? "/listener/dashboard"
      : user?.role === "ADMIN"
        ? "/admin/dashboard"
        : user
          ? "/explore"
          : "/auth?mode=signup&role=talk";

  const primaryLabel =
    isLoadingSession
      ? "Loading"
      : user?.role === "LISTENER"
      ? "Dashboard"
      : user?.role === "ADMIN"
        ? "Admin"
        : user
          ? "Explore"
          : "Sign Up";

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });
      setUser(null);
      router.push("/auth?mode=signin&role=talk");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-20 px-4 sm:px-6 md:px-8 gap-4">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-on-surface shrink-0">
          Konfide
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/#how-it-works" className="text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight">
            How it works
          </Link>
          <Link href="/join" className={linkClass("/join")}>
            Become a listener
          </Link>
          <Link href="/#faq" className="text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {!isLoadingSession && user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-sm md:text-base text-on-surface/70 hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          ) : null}
          {primaryHref ? (
            <Link
              href={primaryHref}
              className="px-4 py-2 text-sm sm:text-base sm:px-5 md:px-6 md:py-2.5 bg-primary text-on-surface font-semibold hover:opacity-90 transition-all rounded-none"
            >
              {primaryLabel}
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm sm:text-base sm:px-5 md:px-6 md:py-2.5 bg-surface-container text-on-surface-variant font-semibold rounded-none animate-pulse">
              {primaryLabel}
            </span>
          )}
        </div>
      </div>
      <div className="bg-surface-container-high h-px w-full absolute bottom-0" />
    </nav>
  );
}
