"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/shared/Footer";

type ListenerLayoutShellProps = {
  children: React.ReactNode;
};

export default function ListenerLayoutShell({ children }: ListenerLayoutShellProps) {
  const pathname = usePathname();
  const isChatRoute = /^\/listener\/sessions\/[^/]+\/chat$/.test(pathname);

  return (
    <>
      <main
        className={
          isChatRoute
            ? "px-0 pb-0 pt-14 sm:pt-16"
            : "mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 md:px-8"
        }
      >
        {children}
      </main>
      {!isChatRoute ? <Footer /> : null}
    </>
  );
}
