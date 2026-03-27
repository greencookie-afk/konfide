import Image from "next/image";
import Link from "next/link";
import type { UserRole } from "@/generated/prisma";
import NavbarLinks, { type NavbarLinkItem } from "@/components/shared/NavbarLinks";
import MobileWorkspaceMenu from "@/components/shared/MobileWorkspaceMenu";
import NotificationsMenu from "@/components/shared/NotificationsMenu";
import SignOutButton from "@/features/account/components/SignOutButton";
import { getCurrentUser } from "@/server/auth/server";
import { getNavbarNotifications } from "@/server/notifications/service";

function getNavLinks(role: UserRole | undefined): NavbarLinkItem[] {
  if (role === "TALKER") {
    return [
      { href: "/explore", label: "Explore" },
      { href: "/sessions", label: "Chats" },
    ];
  }

  if (role === "LISTENER") {
    return [
      { href: "/listener/sessions", label: "Chats" },
      { href: "/listener/dashboard", label: "Dashboard" },
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
  const workspaceHref = user?.role === "LISTENER" ? "/listener/dashboard" : user ? "/explore" : "/";
  const workspaceLabel = user?.role === "LISTENER" ? "Dashboard" : user ? "Explore" : "Konfide";
  const primaryHref = user ? null : "/auth?mode=signup&role=talk";
  const primaryLabel = user ? null : "Sign Up";
  const primaryLabelCompact = "Join";
  const userInitial = (user?.name || user?.email || "K").charAt(0).toUpperCase();
  const accountHref = user?.role === "LISTENER" ? "/listener/profile" : "/account";
  const accountLabel = user?.role === "LISTENER" ? "Profile" : "Account";
  const signOutHref = user?.role === "LISTENER" ? "/auth?mode=signin&role=listen" : "/auth?mode=signin&role=talk";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-on-surface/8 bg-surface/92 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:min-h-16 sm:px-6 md:px-8">
        <Link
          href={workspaceHref}
          className={`shrink-0 font-bold tracking-tight text-on-surface ${
            isAuthenticatedUser ? "text-sm uppercase tracking-[0.22em]" : "text-xl"
          }`}
        >
          {workspaceLabel}
        </Link>

        <div className="hidden md:flex">
          <NavbarLinks items={navLinks} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticatedUser ? (
            <>
              <NotificationsMenu notifications={notifications} storageKey={`konfide-notifications:${user?.id}`} />
              <Link
                href={accountHref}
                aria-label={accountLabel}
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden bg-surface-container-highest ring-1 ring-on-surface/5"
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
              <div className="hidden md:block">
                <SignOutButton variant="ghost" redirectTo={signOutHref} />
              </div>
              <MobileWorkspaceMenu
                navLinks={navLinks}
                workspaceHref={workspaceHref}
                workspaceLabel={workspaceLabel}
                accountHref={accountHref}
                accountLabel={accountLabel}
                signOutHref={signOutHref}
              />
            </>
          ) : null}

          {primaryHref && primaryLabel ? (
            <Link
              href={primaryHref}
              className="inline-flex min-w-0 items-center justify-center bg-primary px-3 py-2 text-xs font-semibold text-on-surface transition-all hover:opacity-90 sm:px-5 sm:text-sm md:px-6"
            >
              <span className="sm:hidden">{primaryLabelCompact}</span>
              <span className="hidden sm:inline">{primaryLabel}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
