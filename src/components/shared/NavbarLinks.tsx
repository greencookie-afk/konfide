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
    <div className="flex items-center gap-10">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            item.isStatic
              ? "text-lg tracking-tight text-on-surface/60 transition-colors hover:text-on-surface"
              : isActiveRoute(item.href)
                ? "border-b-2 border-primary pb-1 text-lg tracking-tight text-on-surface"
                : "text-lg tracking-tight text-on-surface/60 transition-colors hover:text-on-surface"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
