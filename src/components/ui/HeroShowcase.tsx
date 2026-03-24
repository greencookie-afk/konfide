import Image from "next/image";

export default function HeroShowcase() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Desktop Chat Screen */}
      <div className="relative">
        {/* Browser Chrome */}
        <div className="bg-surface-container-highest rounded-t-lg md:rounded-t-xl px-3 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-3 border border-on-surface/5 border-b-0">
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400/70" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400/70" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 min-w-0 flex justify-center">
            <div className="max-w-[11rem] min-[420px]:max-w-[14rem] sm:max-w-[18rem] md:max-w-none bg-surface-container px-3 sm:px-4 md:px-6 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs text-on-surface-variant flex items-center gap-2">
              <svg className="w-3 h-3 text-green-600 hidden min-[420px]:block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="truncate">konfide.app/chat/session</span>
            </div>
          </div>
        </div>

        {/* Chat App UI */}
        <div className="bg-surface rounded-b-lg md:rounded-b-xl border border-on-surface/5 border-t-0 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
          <div className="flex h-[330px] min-[420px]:h-[360px] sm:h-[400px] md:h-[520px]">
            {/* Sidebar — hidden on mobile */}
            <div className="hidden md:flex w-64 lg:w-72 bg-surface-container-low border-r border-on-surface/5 flex-col">
              <div className="p-4 lg:p-5 border-b border-on-surface/5">
                <h3 className="font-bold text-base lg:text-lg">Messages</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                {[
                  { name: "Sarah Jenkins", msg: "By being kind to myself...", time: "now", active: true, online: true, imgUrl: "/images/portrait_three_1774343056010.png" },
                  { name: "Marcus Taylor", msg: "Let's continue tomorrow", time: "2h", active: false, online: true, imgUrl: "/images/portrait_two_1774343033404.png" },
                  { name: "Elena Rodriguez", msg: "Session booked for Friday", time: "5h", active: false, online: false, imgUrl: "/images/portrait_one_1774343011664.png" },
                  { name: "David Lee", msg: "Thank you so much 🙏", time: "1d", active: false, online: false, imgUrl: "/images/portrait_four_1774343074850.png" },
                ].map((contact) => (
                  <div
                    key={contact.name}
                    className={`flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-4 transition-colors cursor-pointer ${
                      contact.active
                        ? "bg-primary-container/30 border-l-2 border-primary"
                        : "hover:bg-surface-container border-l-2 border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <Image src={contact.imgUrl} alt={contact.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover bg-surface-container-high" />
                      {contact.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-surface-container-low" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className={`text-sm truncate ${contact.active ? "font-bold" : "font-medium"}`}>
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/60 ml-2 shrink-0">{contact.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">{contact.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="relative isolate flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="relative z-20 shrink-0 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-on-surface/5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <Image src="/images/portrait_three_1774343056010.png" alt="Sarah Jenkins" width={40} height={40} className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover bg-surface-container-high shrink-0" />
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-xs md:text-sm truncate">Sarah Jenkins</h4>
                    <p className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                  <button
                    type="button"
                    aria-label="Start audio call"
                    className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs md:text-base transition-colors hover:bg-surface-container-high"
                  >
                    📞
                  </button>
                  <button
                    type="button"
                    aria-label="Start video call"
                    className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs md:text-base transition-colors hover:bg-surface-container-high"
                  >
                    📹
                  </button>
                  <button
                    type="button"
                    aria-label="Open more options"
                    className="hidden cursor-pointer sm:flex w-7 h-7 md:w-9 md:h-9 rounded-full bg-surface-container items-center justify-center text-on-surface-variant text-xs md:text-base transition-colors hover:bg-surface-container-high"
                  >
                    ⋯
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="relative z-0 flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 flex flex-col gap-2.5 sm:gap-3 md:gap-4 overflow-hidden">
                <div className="text-center">
                  <span className="text-[9px] md:text-[10px] text-on-surface-variant/50 uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full">
                    Today, 2:30 PM
                  </span>
                </div>
                <div className="max-w-[88%] sm:max-w-[80%] md:max-w-[70%] self-start">
                  <div className="bg-surface-container-high px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tl-sm">
                    <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed">I completely understand how overwhelming that return to work can feel. I was in your exact shoes two years ago.</p>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-on-surface-variant/50 mt-1 ml-1 block">2:30 PM</span>
                </div>
                <div className="max-w-[88%] sm:max-w-[80%] md:max-w-[70%] self-end">
                  <div className="bg-primary px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tr-sm text-on-surface">
                    <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed">It&apos;s the guilt that&apos;s the hardest part. How did you manage it in the first few weeks?</p>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-on-surface-variant/50 mt-1 mr-1 block text-right">2:31 PM</span>
                </div>
                <div className="max-w-[88%] sm:max-w-[80%] md:max-w-[70%] self-start">
                  <div className="bg-surface-container-high px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tl-sm">
                    <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed">By being kind to myself. We can talk through some of the boundaries I set with my manager if that helps?</p>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-on-surface-variant/50 mt-1 ml-1 block">2:32 PM</span>
                </div>
              </div>

              {/* Input */}
              <div className="relative z-10 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-t border-on-surface/5">
                <div className="flex items-center gap-2 md:gap-3 bg-surface-container px-3 md:px-4 py-2 md:py-3 rounded-lg border border-on-surface/5">
                  <button type="button" className="text-on-surface-variant/50 text-sm shrink-0">📎</button>
                  <span className="text-[11px] sm:text-xs md:text-sm text-on-surface-variant/40 flex-1 truncate">Type a message...</span>
                  <button type="button" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-on-surface text-xs md:text-sm shrink-0">➤</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow behind the screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/10 via-primary-container/10 to-primary/5 blur-[100px] rounded-full -z-10" />
    </div>
  );
}
