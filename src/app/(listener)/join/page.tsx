import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, MessageCircleHeart, NotebookPen, SlidersHorizontal } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function JoinPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <Navbar />

      <main>
        <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-6 pb-16 pt-24 md:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <span className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
                Build your listener workspace
              </span>
              <h1 className="mb-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-on-surface md:text-5xl">
                Support people with a <br /> <span className="text-primary">profile you control</span>
              </h1>
              <p className="mb-6 max-w-md text-base font-light leading-relaxed text-on-surface-variant">
                Create a listener account, write your public profile, set your weekly availability, and publish when
                you are ready to accept bookings.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth?mode=signup&role=listen"
                  className="rounded-none bg-primary px-6 py-3 text-center font-bold text-on-surface shadow-md transition-all hover:opacity-95 hover:shadow-lg"
                >
                  Create listener account
                </Link>
                <Link
                  href="#requirements"
                  className="rounded-none bg-surface-container px-6 py-3 text-center font-bold text-on-surface transition-all hover:bg-surface-container-high"
                >
                  See the setup flow
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-[22px] bg-surface-container-low shadow-xl ring-1 ring-black/5 md:h-[500px] md:rounded-[28px]">
              <Image
                alt="Person listening intently with headphones"
                className="object-cover"
                fill
                preload
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 560px"
                src="/images/stitch_hero_listener.png"
              />
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-secondary/20 to-transparent" />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-6 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Why create a listener workspace?</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container/30">
                  <CalendarDays className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Set your own schedule</h3>
                <p className="leading-relaxed text-on-surface-variant">
                  Add weekly availability in 15-minute blocks and pause new bookings anytime.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container/30">
                  <NotebookPen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Publish only when ready</h3>
                <p className="leading-relaxed text-on-surface-variant">
                  Your profile stays private to users until you add the details you want and turn publishing on.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container/30">
                  <LayoutDashboard className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">See real session activity</h3>
                <p className="leading-relaxed text-on-surface-variant">
                  Upcoming sessions, completed sessions, and earnings update from actual bookings instead of demo data.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="requirements" className="relative mx-auto max-w-7xl px-6 py-16 md:px-8">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary-container/10 via-transparent to-transparent blur-[120px]" />

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">Three real steps to go live</h2>
            <p className="text-sm text-on-surface-variant md:text-base">
              No interview placeholders here. The current flow is simple: create your account, finish your profile,
              then set availability.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative rounded-2xl border border-on-surface/5 bg-surface-container-lowest p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <span className="absolute right-6 top-6 text-5xl font-black text-surface-container-highest opacity-50 mix-blend-multiply">01</span>
              <div className="relative z-10 pt-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                  <MessageCircleHeart className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">Create your account</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Start with a listener sign-up so you can access the dashboard and workspace pages.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-on-surface/5 bg-surface-container-lowest p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <span className="absolute right-6 top-6 text-5xl font-black text-surface-container-highest opacity-50 mix-blend-multiply">02</span>
              <div className="relative z-10 pt-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                  <NotebookPen className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">Build your public profile</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Add your slug, headline, about section, specialties, languages, and rate from the listener dashboard.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-on-surface/5 bg-surface-container-lowest p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <span className="absolute right-6 top-6 text-5xl font-black text-surface-container-highest opacity-50 mix-blend-multiply">03</span>
              <div className="relative z-10 pt-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">Set availability and publish</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Add your weekly time blocks, turn bookings on, and publish when you want to appear in browse.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-on-surface px-6 py-16 text-center text-surface md:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to set up your listing?</h2>
            <p className="mb-8 text-base font-light text-surface/75 md:text-lg">
              Create the account now. You can add rate, profile details, and availability at your own pace.
            </p>
            <Link
              href="/auth?mode=signup&role=listen"
              className="inline-block rounded-none bg-primary px-8 py-4 text-base font-bold text-on-surface shadow-lg transition-all hover:scale-[1.02] hover:opacity-90 md:text-lg"
            >
              Create listener account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
