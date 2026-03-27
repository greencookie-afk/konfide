import Link from "next/link";
import { Compass, LayoutList, MessageSquareMore } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import HeroShowcase from "@/components/ui/HeroShowcase";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-surface">
      <Navbar />

      <section
        className="relative px-6 pb-20 pt-28 text-center md:px-8"
        style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #FFF8E6 32%, #FFFDF5 72%, #FFFFFF 100%)" }}
      >
        <div className="absolute left-1/4 top-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary/10 via-primary-container/15 to-transparent blur-[120px]" />
        <div className="absolute right-1/4 top-20 h-[350px] w-[350px] rounded-full bg-gradient-to-bl from-primary-container/15 via-primary/5 to-transparent blur-[100px]" />

        <div className="relative z-20 mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">Peer support, kept practical</p>
          <h1 className="mb-4 text-2xl font-bold leading-[1.15] tracking-tight text-on-surface sm:text-3xl md:text-4xl lg:text-5xl">
            Talk to someone who actually gets it.
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-sm font-light leading-relaxed text-on-surface-variant sm:text-base md:text-lg">
            Browse published listeners, see who is active now, send a request, and start chatting as soon as it is
            accepted.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/explore"
              className="inline-flex rounded-none bg-primary px-5 py-2.5 text-xs font-bold text-on-surface shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] sm:px-7 sm:py-3 sm:text-sm"
            >
              Find a listener
            </Link>
            <Link
              href="/join"
              className="inline-flex rounded-none bg-surface-container-high px-5 py-2.5 text-xs font-bold text-on-surface transition-all hover:bg-surface-container-highest active:scale-[0.98] sm:px-7 sm:py-3 sm:text-sm"
            >
              Become a listener
            </Link>
          </div>
        </div>

        <div className="pointer-events-none relative z-10 mt-8 px-4 md:px-8">
          <HeroShowcase />
        </div>
      </section>

      <section className="relative overflow-hidden bg-on-surface py-20 text-surface md:py-32">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-container/20 to-transparent blur-[100px]" />
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-0 border-y border-surface/10 md:grid-cols-3">
            <div className="flex flex-col gap-4 border-b border-surface/10 p-8 transition-colors hover:bg-surface/5 md:border-b-0 md:border-r md:p-12 md:gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-surface md:text-2xl">Live listener discovery</h3>
              <p className="text-sm leading-relaxed text-surface/70 md:text-base">
                Browse listeners by their real profile, specialties, and whether they are active now or just accepting
                requests.
              </p>
            </div>
            <div className="flex flex-col gap-4 border-b border-surface/10 p-8 transition-colors hover:bg-surface/5 md:border-b-0 md:border-r md:p-12 md:gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
                <MessageSquareMore className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-surface md:text-2xl">Request, accept, chat</h3>
              <p className="text-sm leading-relaxed text-surface/70 md:text-base">
                The flow is intentionally light: send a request, let the listener accept, and start chatting in one
                shared room.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-8 transition-colors hover:bg-surface/5 md:p-12 md:gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
                <LayoutList className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-surface md:text-2xl">Everything stays organized</h3>
              <p className="text-sm leading-relaxed text-surface/70 md:text-base">
                Requests, accepted chats, and older conversations stay attached to the same session record so context is
                never lost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative overflow-hidden px-6 py-20 md:px-8 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low via-surface to-surface-container-low" />
        <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-container/10 to-transparent blur-[80px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 md:mb-20">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
            <div className="h-1 w-20 bg-primary" />
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="group flex flex-col gap-6 border border-on-surface/5 bg-surface p-8 transition-shadow hover:shadow-lg md:gap-8 md:p-10">
              <div className="text-5xl font-black text-primary/30 transition-colors group-hover:text-primary/60 md:text-6xl">01</div>
              <div>
                <h4 className="mb-4 text-2xl font-bold">Find the right fit</h4>
                <p className="leading-relaxed text-on-surface-variant">
                  Explore listener profiles, specialties, and languages before you decide who to reach out to.
                </p>
              </div>
            </div>
            <div className="group flex flex-col gap-6 border border-on-surface/5 bg-surface p-8 transition-shadow hover:shadow-lg md:gap-8 md:p-10">
              <div className="text-5xl font-black text-primary/30 transition-colors group-hover:text-primary/60 md:text-6xl">02</div>
              <div>
                <h4 className="mb-4 text-2xl font-bold">Send a chat request</h4>
                <p className="leading-relaxed text-on-surface-variant">
                  Share your topic and a little context so the listener knows how to meet you well.
                </p>
              </div>
            </div>
            <div className="group flex flex-col gap-6 border border-on-surface/5 bg-surface p-8 transition-shadow hover:shadow-lg md:gap-8 md:p-10">
              <div className="text-5xl font-black text-primary/30 transition-colors group-hover:text-primary/60 md:text-6xl">03</div>
              <div>
                <h4 className="mb-4 text-2xl font-bold">Start talking</h4>
                <p className="leading-relaxed text-on-surface-variant">
                  Once the listener accepts, the conversation begins in the shared chat without extra steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-on-surface px-5 py-14 text-surface sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-container">Built for the next step</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Keep the path to connection simple.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-surface/75 md:text-base">
            Listener profiles, live availability, request acceptance, sessions, and chat now work together without
            extra steps in the middle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/explore"
              className="inline-flex rounded-none bg-primary px-6 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
            >
              Explore listeners
            </Link>
            <Link
              href="/join"
              className="inline-flex rounded-none border border-surface/15 px-6 py-3 text-sm font-semibold text-surface transition hover:bg-surface/5"
            >
              Set up listener workspace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
