import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-on-surface/6 bg-surface-container-low px-5 py-12 sm:px-8 sm:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-4">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface">
              Konfide
            </Link>
            <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Peer listening with real profiles, real availability, and booking flows that only show what is actually
              ready to use.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-on-surface-variant sm:gap-6">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/explore" className="transition-colors hover:text-primary">
              Explore
            </Link>
            <Link href="/#how-it-works" className="transition-colors hover:text-primary">
              How it works
            </Link>
            <Link href="/join" className="transition-colors hover:text-primary">
              Become a listener
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-on-surface/10 pt-6">
          <p className="text-center text-[10px] uppercase tracking-[0.18em] text-on-surface/50 sm:text-left sm:text-sm sm:tracking-widest">
            © {new Date().getFullYear()} Konfide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
