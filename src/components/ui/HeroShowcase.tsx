import Image from "next/image";

export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-on-surface/5 bg-surface-container-highest px-3 py-2 md:gap-3 md:rounded-t-xl md:px-5 md:py-3">
          <div className="flex gap-1.5 md:gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400/70 md:h-3 md:w-3" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/70 md:h-3 md:w-3" />
            <div className="h-2 w-2 rounded-full bg-green-400/70 md:h-3 md:w-3" />
          </div>
          <div className="flex min-w-0 flex-1 justify-center">
            <div className="flex max-w-[11rem] items-center gap-2 rounded-md bg-surface-container px-3 py-1 text-[10px] text-on-surface-variant min-[420px]:max-w-[14rem] sm:max-w-[18rem] sm:px-4 md:max-w-none md:px-6 md:py-1.5 md:text-xs">
              <svg className="hidden h-3 w-3 text-green-600 min-[420px]:block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 00-6 0v2h6z" clipRule="evenodd" />
              </svg>
              <span className="truncate">konfide.app/explore</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-lg border border-t-0 border-on-surface/5 bg-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] md:rounded-b-xl">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-on-surface/5 bg-surface-container-low p-4 sm:p-5 md:border-b-0 md:border-r md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Published listener</p>
              <div className="mt-4 flex items-start gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-[18px] bg-surface-container-high">
                  <Image
                    src="/images/portrait_three_1774343056010.png"
                    alt="Listener portrait"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-on-surface">Sarah Jenkins</h3>
                    <span className="rounded-full bg-primary-container px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-on-primary-container">
                      Verified
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-on-surface">Gentle support for work stress and burnout</p>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                    Published profiles show real specialties, language, pricing, and availability before a booking is
                    made.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] bg-surface px-4 py-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Rate</p>
                  <p className="mt-2 text-lg font-bold text-on-surface">$1.00/min</p>
                </div>
                <div className="rounded-[18px] bg-surface px-4 py-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Languages</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">English, Hindi</p>
                </div>
                <div className="rounded-[18px] bg-surface px-4 py-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Next opening</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">Today, 6:30 PM</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Booking flow</p>
              <div className="mt-4 rounded-[20px] border border-primary/10 bg-primary-container p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-on-primary-container">Book a session</p>
                    <p className="text-sm text-on-primary-container/75">Choose time, add notes, confirm</p>
                  </div>
                  <p className="text-sm font-semibold text-on-primary-container">$45 total</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Date", value: "Tue, Oct 24" },
                  { label: "Time", value: "6:30 PM" },
                  { label: "Duration", value: "45 minutes" },
                  { label: "Topic", value: "Work stress" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[16px] border border-on-surface/5 bg-surface px-4 py-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-on-surface">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[18px] border border-on-surface/5 bg-surface-container-low px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">After confirmation</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  The booking appears in user sessions and in the listener workspace, so both sides are looking at the
                  same schedule.
                </p>
                <div className="mt-4 inline-flex rounded-none bg-on-surface px-4 py-2 text-sm font-semibold text-surface">
                  Confirm booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/10 via-primary-container/10 to-primary/5 blur-[100px]" />
    </div>
  );
}
