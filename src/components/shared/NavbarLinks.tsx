"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavbarLinkItem = {
  href: string;
  label: string;
  isStatic?: boolean;
};

type NavbarLinksProps = {
  items: NavbarLinkItem[];
};

export default function NavbarLinks({ items }: NavbarLinksProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <div className="flex items-center gap-5">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            item.isStatic
              ? "border-b border-transparent pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant transition-colors hover:text-on-surface"
              : isActiveRoute(item.href)
                ? "border-b border-primary pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface"
                : "border-b border-transparent pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant transition-colors hover:text-on-surface"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
