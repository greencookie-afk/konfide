import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-surface-container-low selection:bg-primary-container selection:text-on-primary-container">
      <div className="flex flex-col items-center gap-8 max-w-4xl w-full">
        <h1 className="text-6xl font-headline font-bold text-on-surface tracking-tight text-center">
          Talk to someone who <span className="text-primary italic">actually</span> gets it.
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl text-center">
          Konfide connects you with verified peer listeners who have walked in your shoes. Zero judgment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full">
          <Link href="/explore" className="p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-colors border border-on-surface/5">
            <h3 className="font-bold text-lg">Browse Listeners →</h3>
            <p className="text-sm text-on-surface-variant mt-2">Find your perfect match</p>
          </Link>

          <Link href="/listener/dashboard" className="p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-colors border border-on-surface/5">
            <h3 className="font-bold text-lg">Listener Dashboard →</h3>
            <p className="text-sm text-on-surface-variant mt-2">Manage your sessions</p>
          </Link>

          <Link href="/chat/demo" className="p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-colors border border-on-surface/5">
            <h3 className="font-bold text-lg">Chat Room →</h3>
            <p className="text-sm text-on-surface-variant mt-2">Enter a live session</p>
          </Link>

          <Link href="/admin/dashboard" className="p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-colors border border-on-surface/5">
            <h3 className="font-bold text-lg">Admin Panel →</h3>
            <p className="text-sm text-on-surface-variant mt-2">Platform moderation</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
