import Image from "next/image";
import Link from "next/link";
import type { UserRole } from "@/generated/prisma";
import NavbarLinks, { type NavbarLinkItem } from "@/components/shared/NavbarLinks";
import NotificationsMenu from "@/components/shared/NotificationsMenu";
import SignOutButton from "@/features/account/components/SignOutButton";
import { getCurrentUser } from "@/server/auth/server";
import { getNavbarNotifications } from "@/server/notifications/service";

function getNavLinks(role: UserRole | undefined): NavbarLinkItem[] {
  if (role === "TALKER") {
    return [
      { href: "/explore", label: "Explore" },
      { href: "/sessions", label: "Sessions" },
      { href: "/account", label: "My Account" },
    ];
  }

  if (role === "LISTENER") {
    return [
      { href: "/listener/sessions", label: "Sessions" },
      { href: "/listener/dashboard", label: "My Dashboard" },
      { href: "/listener/availability", label: "Availability" },
    ];
  }

  return [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How it works", isStatic: true },
    { href: "/join", label: "Become a listener" },
  ];
}

export default async function Navbar() {
  const user = await getCurrentUser();
  const isAuthenticatedUser = Boolean(user && user.role !== "ADMIN");
  const notifications = user ? await getNavbarNotifications(user.id, user.role) : [];
  const navLinks = getNavLinks(user?.role);
  const primaryHref = user?.role === "LISTENER" ? "/listener/profile" : user ? null : "/auth?mode=signup&role=talk";
  const primaryLabel = user?.role === "LISTENER" ? "Edit Profile" : user ? null : "Sign Up";
  const primaryLabelCompact = user?.role === "LISTENER" ? "Profile" : "Join";
  const userInitial = (user?.name || user?.email || "K").charAt(0).toUpperCase();
  const accountHref = user?.role === "LISTENER" ? "/listener/dashboard" : "/account";
  const signOutHref = user?.role === "LISTENER" ? "/auth?mode=signin&role=listen" : "/auth?mode=signin&role=talk";

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:min-h-20 sm:gap-4 sm:px-6 md:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tighter text-on-surface sm:text-2xl">
          Konfide
        </Link>

        <div className="hidden md:flex">
          <NavbarLinks items={navLinks} />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {isAuthenticatedUser ? (
            <>
              <NotificationsMenu notifications={notifications} storageKey={`konfide-notifications:${user?.id}`} />
              <Link
                href={accountHref}
                aria-label="My account"
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-on-surface/5 sm:h-10 sm:w-10"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name ? `${user.name} avatar` : "User avatar"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-on-surface">{userInitial}</span>
                )}
              </Link>
              {user?.role === "LISTENER" ? (
                <div className="hidden sm:block">
                  <SignOutButton variant="ghost" redirectTo={signOutHref} />
                </div>
              ) : null}
            </>
          ) : null}

          {primaryHref && primaryLabel ? (
            <Link
              href={primaryHref}
              className="inline-flex min-w-0 items-center justify-center rounded-none bg-primary px-3 py-2 text-xs font-semibold text-on-surface transition-all hover:opacity-90 sm:px-5 sm:text-base md:px-6 md:py-2.5"
            >
              <span className="sm:hidden">{primaryLabelCompact}</span>
              <span className="hidden sm:inline">{primaryLabel}</span>
            </Link>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-0 h-px w-full bg-surface-container-high" />
    </nav>
  );
}
