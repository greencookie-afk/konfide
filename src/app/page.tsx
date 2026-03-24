import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex flex-col gap-10 flex-1">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-on-surface leading-[1.05]">
            Talk to someone who <span className="text-primary italic">actually</span> gets it
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed font-light">
            Konfide connects you with verified peer listeners who have walked in your shoes. Professional support, human connection, zero judgment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/explore"
              className="px-10 py-5 bg-primary text-on-primary font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] shadow-sm text-center"
            >
              Find a listener
            </Link>
            <Link
              href="/join"
              className="px-10 py-5 bg-surface-container-high text-on-surface font-bold text-lg hover:bg-surface-container-highest transition-all active:scale-[0.98] text-center"
            >
              Apply to join
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-6 opacity-80">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-primary-container" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-secondary-container" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-tertiary-container" />
            </div>
            <span className="text-sm font-semibold tracking-wide">+2,400 people supported this week</span>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="relative flex justify-center lg:justify-end flex-1 w-full">
          <div className="relative w-[320px] h-[640px] bg-on-surface rounded-[3.5rem] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/10 overflow-hidden">
            <div className="w-full h-full bg-surface rounded-[2.8rem] overflow-hidden flex flex-col border border-white/10 shadow-inner">
              {/* Status Bar */}
              <div className="h-10 px-8 flex justify-between items-center bg-surface pt-4">
                <span className="text-xs font-bold">9:41</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-4 h-2.5 border border-on-surface/20 rounded-[2px] relative">
                    <div className="absolute inset-[1px] bg-on-surface rounded-[1px]" />
                  </div>
                </div>
              </div>
              {/* App Header */}
              <div className="px-6 py-6 flex items-center justify-between">
                <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-sm">←</button>
                <div className="text-center">
                  <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-600" /> Online
                  </p>
                </div>
                <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-sm">⋯</button>
              </div>
              {/* Chat Messages */}
              <div className="flex-1 px-6 flex flex-col gap-6 pt-4">
                <div className="max-w-[85%] self-start bg-surface-container-high p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">I completely understand how overwhelming that return to work can feel. I was in your exact shoes two years ago.</p>
                </div>
                <div className="max-w-[85%] self-end bg-primary p-4 rounded-2xl rounded-tr-none text-on-primary">
                  <p className="text-sm leading-relaxed">It&apos;s the guilt that&apos;s the hardest part. How did you manage it in the first few weeks?</p>
                </div>
                <div className="max-w-[85%] self-start bg-surface-container-high p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">By being kind to myself. We can talk through some of the boundaries I set with my manager if that helps?</p>
                </div>
              </div>
              {/* Input Bar */}
              <div className="p-6 bg-surface mt-auto">
                <div className="flex items-center gap-3 bg-surface-container p-3 rounded-full border border-on-surface/10">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-lg">+</div>
                  <div className="text-on-surface-variant/40 text-sm">Type a message...</div>
                  <span className="ml-auto text-primary">➤</span>
                </div>
                <div className="h-1 w-32 bg-on-surface/10 rounded-full mx-auto mt-6 mb-2" />
              </div>
            </div>
            {/* Side Buttons */}
            <div className="absolute -right-[2px] top-32 w-[3px] h-16 bg-on-surface/80 rounded-l-md" />
            <div className="absolute -left-[2px] top-28 w-[3px] h-10 bg-on-surface/80 rounded-r-md" />
            <div className="absolute -left-[2px] top-44 w-[3px] h-10 bg-on-surface/80 rounded-r-md" />
          </div>
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary-container/15 blur-[140px] rounded-full -z-10" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-0 border-y border-on-surface/10">
          <div className="p-12 border-r border-on-surface/10 flex flex-col gap-6 hover:bg-surface-container-lowest transition-colors">
            <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary text-2xl">✓</div>
            <h3 className="text-2xl font-bold tracking-tight">Vetted expertise</h3>
            <p className="text-on-surface-variant leading-relaxed">Every listener undergoes a rigorous 4-step background check and trauma-informed training before joining the platform.</p>
          </div>
          <div className="p-12 border-r border-on-surface/10 flex flex-col gap-6 hover:bg-surface-container-lowest transition-colors">
            <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary text-2xl">₹</div>
            <h3 className="text-2xl font-bold tracking-tight">Simple pricing</h3>
            <p className="text-on-surface-variant leading-relaxed">No subscriptions. Pay as you go sessions starting at ₹250 per hour. Access quality support without long-term commitment.</p>
          </div>
          <div className="p-12 flex flex-col gap-6 hover:bg-surface-container-lowest transition-colors">
            <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary text-2xl">⏰</div>
            <h3 className="text-2xl font-bold tracking-tight">Always online</h3>
            <p className="text-on-surface-variant leading-relaxed">Connect with someone within 5 minutes, 24/7. Our network ensures support is available whenever you need it most.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <div className="w-20 h-1 bg-primary" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface p-10 flex flex-col gap-8 group">
              <div className="text-6xl font-black text-primary-container/40 group-hover:text-primary-container transition-colors">01</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Choose your match</h4>
                <p className="text-on-surface-variant leading-relaxed">Filter listeners by lived experience, language, and specialty to find the person who understands your journey.</p>
              </div>
            </div>
            <div className="bg-surface p-10 flex flex-col gap-8 group">
              <div className="text-6xl font-black text-primary-container/40 group-hover:text-primary-container transition-colors">02</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Book a session</h4>
                <p className="text-on-surface-variant leading-relaxed">Choose an immediate &apos;Quick Connect&apos; or schedule a time that works for you. Private, encrypted, and anonymous.</p>
              </div>
            </div>
            <div className="bg-surface p-10 flex flex-col gap-8 group">
              <div className="text-6xl font-black text-primary-container/40 group-hover:text-primary-container transition-colors">03</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Get support</h4>
                <p className="text-on-surface-variant leading-relaxed">Connect via text, voice, or video. After your session, you only pay for the time you used. No strings attached.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listener Showcase */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight mb-4">A network built on empathy</h2>
            <p className="text-on-surface-variant">Our listeners aren&apos;t just experts; they&apos;ve been where you are. We verify every credential and experience story.</p>
          </div>
          <Link href="/explore" className="text-primary font-bold flex items-center gap-2 group underline underline-offset-4">
            View full directory <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Elena R.", rating: "4.9", specialty: "Postpartum Support" },
            { name: "Marcus T.", rating: "5.0", specialty: "Career Burnout" },
            { name: "Sasha K.", rating: "4.8", specialty: "Grief & Loss" },
            { name: "David L.", rating: "5.0", specialty: "Life Transition" },
          ].map((listener) => (
            <div key={listener.name} className="bg-surface-container-low p-6 flex flex-col gap-4">
              <div className="w-full aspect-[4/5] bg-surface-container rounded-sm" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-lg">{listener.name}</span>
                  <div className="flex items-center text-primary">
                    <span className="text-sm">★</span>
                    <span className="text-sm font-bold ml-1">{listener.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{listener.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 bg-on-surface text-surface overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Community stories</h2>
            <div className="w-20 h-1 bg-primary-container" />
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col gap-8">
              <p className="text-3xl font-medium leading-tight">
                &quot;I was struggling with returning to work after maternity leave and felt like nobody in my circle quite understood the guilt. Finding Sarah on Konfide changed everything. She&apos;d been through exactly the same thing 2 years ago.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-sm" />
                <div>
                  <p className="font-bold">Jessica W.</p>
                  <p className="text-sm opacity-60">Marketing Director &amp; Mom</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-3xl font-medium leading-tight">
                &quot;Therapy felt too clinical for what I was going through. I just needed to talk to another man who had dealt with high-pressure corporate burnout without feeling like a patient. Konfide gave me that space.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-sm" />
                <div>
                  <p className="font-bold">Tom B.</p>
                  <p className="text-sm opacity-60">Software Engineering Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
