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
              <span className="truncate">konfide.app/session/live</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-lg border border-t-0 border-on-surface/5 bg-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] md:rounded-b-xl">
          <div className="flex h-[330px] min-[420px]:h-[360px] sm:h-[400px] md:h-[520px]">
            <div className="hidden w-64 flex-col border-r border-on-surface/5 bg-surface-container-low md:flex lg:w-72">
              <div className="border-b border-on-surface/5 p-4 lg:p-5">
                <h3 className="text-base font-bold lg:text-lg">Messages</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                {[
                  {
                    name: "Sarah Jenkins",
                    msg: "By being kind to myself...",
                    time: "now",
                    active: true,
                    online: true,
                    imgUrl: "/images/portrait_three_1774343056010.png",
                  },
                  {
                    name: "Marcus Taylor",
                    msg: "Let's continue tomorrow",
                    time: "2h",
                    active: false,
                    online: true,
                    imgUrl: "/images/portrait_two_1774343033404.png",
                  },
                  {
                    name: "Elena Rodriguez",
                    msg: "Request accepted earlier",
                    time: "5h",
                    active: false,
                    online: false,
                    imgUrl: "/images/portrait_one_1774343011664.png",
                  },
                  {
                    name: "David Lee",
                    msg: "Thank you so much",
                    time: "1d",
                    active: false,
                    online: false,
                    imgUrl: "/images/portrait_four_1774343074850.png",
                  },
                ].map((contact) => (
                  <div
                    key={contact.name}
                    className={`flex cursor-pointer items-center gap-3 border-l-2 px-4 py-3 transition-colors lg:px-5 lg:py-4 ${
                      contact.active
                        ? "border-primary bg-primary-container/30"
                        : "border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={contact.imgUrl}
                        alt={contact.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full bg-surface-container-high object-cover"
                      />
                      {contact.online ? (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-container-low bg-green-500" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className={`truncate text-sm ${contact.active ? "font-bold" : "font-medium"}`}>
                          {contact.name}
                        </span>
                        <span className="ml-2 shrink-0 text-[10px] text-on-surface-variant/60">{contact.time}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-on-surface-variant">{contact.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative isolate flex flex-1 flex-col">
              <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-on-surface/5 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <Image
                    src="/images/portrait_three_1774343056010.png"
                    alt="Sarah Jenkins"
                    width={40}
                    height={40}
                    className="h-7 w-7 shrink-0 rounded-full bg-surface-container-high object-cover sm:h-8 sm:w-8 md:h-10 md:w-10"
                  />
                  <div>
                    <h4 className="truncate text-[11px] font-bold sm:text-xs md:text-sm">Sarah Jenkins</h4>
                    <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-green-600 md:text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                  <span className="hidden border border-on-surface/8 bg-surface-container px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface-variant sm:inline-flex">
                    Encrypted
                  </span>
                  <span className="inline-flex border border-green-600/15 bg-green-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-green-700">
                    Active now
                  </span>
                </div>
              </div>

              <div className="relative z-0 flex flex-1 flex-col gap-2.5 overflow-hidden px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6 md:py-6">
                <div className="text-center">
                  <span className="rounded-full bg-surface-container px-3 py-1 text-[9px] uppercase tracking-widest text-on-surface-variant/50 md:text-[10px]">
                    Today, 2:30 PM
                  </span>
                </div>
                <div className="max-w-[88%] self-start sm:max-w-[80%] md:max-w-[70%]">
                  <div className="rounded-2xl rounded-tl-sm bg-surface-container-high px-3 py-2 md:px-4 md:py-3">
                    <p className="text-[11px] leading-relaxed sm:text-xs md:text-sm">
                      I completely understand how overwhelming that return to work can feel. I was in your exact shoes
                      two years ago.
                    </p>
                  </div>
                  <span className="ml-1 mt-1 block text-[9px] text-on-surface-variant/50 md:text-[10px]">2:30 PM</span>
                </div>
                <div className="max-w-[88%] self-end sm:max-w-[80%] md:max-w-[70%]">
                  <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-on-surface md:px-4 md:py-3">
                    <p className="text-[11px] leading-relaxed sm:text-xs md:text-sm">
                      It&apos;s the guilt that&apos;s the hardest part. How did you manage it in the first few weeks?
                    </p>
                  </div>
                  <span className="mr-1 mt-1 block text-right text-[9px] text-on-surface-variant/50 md:text-[10px]">
                    2:31 PM
                  </span>
                </div>
                <div className="max-w-[88%] self-start sm:max-w-[80%] md:max-w-[70%]">
                  <div className="rounded-2xl rounded-tl-sm bg-surface-container-high px-3 py-2 md:px-4 md:py-3">
                    <p className="text-[11px] leading-relaxed sm:text-xs md:text-sm">
                      By being kind to myself. We can talk through some of the boundaries I set with my manager if that
                      helps?
                    </p>
                  </div>
                  <span className="ml-1 mt-1 block text-[9px] text-on-surface-variant/50 md:text-[10px]">2:32 PM</span>
                </div>
              </div>

              <div className="relative z-10 border-t border-on-surface/5 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-2 rounded-lg border border-on-surface/5 bg-surface-container px-3 py-2 md:gap-3 md:px-4 md:py-3">
                  <button type="button" className="shrink-0 text-sm text-on-surface-variant/50">
                    📎
                  </button>
                  <span className="flex-1 truncate text-[11px] text-on-surface-variant/40 sm:text-xs md:text-sm">
                    Type a message...
                  </span>
                  <button
                    type="button"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-on-surface md:h-8 md:w-8 md:text-sm"
                  >
                    ➤
                  </button>
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
