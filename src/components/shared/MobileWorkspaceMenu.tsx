"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { NavbarLinkItem } from "@/components/shared/NavbarLinks";
import SignOutButton from "@/features/account/components/SignOutButton";

type MobileWorkspaceMenuProps = {
  navLinks: NavbarLinkItem[];
  workspaceHref: string;
  workspaceLabel: string;
  accountHref: string;
  accountLabel: string;
  signOutHref: string;
};

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export default function MobileWorkspaceMenu({
  navLinks,
  workspaceHref,
  workspaceLabel,
  accountHref,
  accountLabel,
  signOutHref,
}: MobileWorkspaceMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-9 w-9 items-center justify-center border border-on-surface/10 bg-surface text-on-surface"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 bg-surface/96 backdrop-blur-sm">
          <div className="border-t border-on-surface/8 px-3 py-3">
            <div className="mx-auto max-w-7xl space-y-3">
              <Link
                href={workspaceHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between border border-on-surface/10 bg-surface-container-lowest px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface"
              >
                <span>Home</span>
                <span className="text-on-surface-variant">{workspaceLabel}</span>
              </Link>

              <div className="grid gap-2">
                {navLinks.map((item) => {
                  const isActive = isActiveRoute(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between border px-3 py-3 text-sm font-medium ${
                        isActive
                          ? "border-primary bg-primary-container text-on-surface"
                          : "border-on-surface/10 bg-surface-container-lowest text-on-surface"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                        Open
                      </span>
                    </Link>
                  );
                })}

                <Link
                  href={accountHref}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between border px-3 py-3 text-sm font-medium ${
                    isActiveRoute(pathname, accountHref)
                      ? "border-primary bg-primary-container text-on-surface"
                      : "border-on-surface/10 bg-surface-container-lowest text-on-surface"
                  }`}
                >
                  <span>{accountLabel}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Open</span>
                </Link>
              </div>

              <div className="border border-on-surface/10 bg-surface-container-lowest p-3">
                <SignOutButton variant="ghost" redirectTo={signOutHref} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
