import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-on-surface">
          Konfide
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-on-surface border-b-2 border-primary pb-1 text-lg tracking-tight">
            Home
          </Link>
          <Link href="#how-it-works" className="text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight">
            How it works
          </Link>
          <Link href="/join" className="text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight">
            Become a listener
          </Link>
          <Link href="#faq" className="text-on-surface/60 hover:text-on-surface transition-colors text-lg tracking-tight">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="px-6 py-2 text-on-surface font-semibold hover:bg-surface-container transition-all"
          >
            Access
          </Link>
        </div>
      </div>
      <div className="bg-surface-container-high h-px w-full absolute bottom-0" />
    </nav>
  );
}
