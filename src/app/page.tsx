import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Coins, Clock } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroShowcase from "@/components/ui/HeroShowcase";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-24 px-6 md:px-8 text-center relative" style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #FFF8E6 30%, #FFFDF5 70%, #FFFFFF 100%)" }}>
        {/* Subtle accent blurs */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/10 via-primary-container/15 to-transparent blur-[120px] rounded-full -z-0" />
        <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-bl from-primary-container/15 via-primary/5 to-transparent blur-[100px] rounded-full -z-0" />

        <div className="max-w-4xl mx-auto relative z-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.15] mb-4">
            Talk to someone who <span>actually</span> <span className="whitespace-nowrap">gets it</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed font-light mb-6">
            Konfide connects you with verified peer listeners who have walked in your shoes. Professional support, human connection, zero judgment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Link
              href="/explore"
              className="inline-flex px-5 sm:px-7 py-2.5 sm:py-3 bg-primary text-on-surface font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98] rounded-none"
            >
              Find a listener
            </Link>
            <Link
              href="/join"
              className="inline-flex px-5 sm:px-7 py-2.5 sm:py-3 bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-none"
            >
              Apply to join
            </Link>
          </div>
        </div>
        <div className="pointer-events-none px-4 md:px-8 mt-8 relative z-10">
          <HeroShowcase />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-on-surface text-surface relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary-container/20 to-transparent blur-[100px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-3 gap-0 border-y border-surface/10">
            <div className="p-8 md:p-12 md:border-r border-b md:border-b-0 border-surface/10 flex flex-col gap-4 md:gap-6 hover:bg-surface/5 transition-colors">
              <div className="w-12 h-12 bg-surface flex items-center justify-center text-primary rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-surface">Vetted expertise</h3>
              <p className="text-surface/70 leading-relaxed text-sm md:text-base">Every listener undergoes a rigorous 4-step background check and trauma-informed training before joining the platform.</p>
            </div>
            <div className="p-8 md:p-12 md:border-r border-b md:border-b-0 border-surface/10 flex flex-col gap-4 md:gap-6 hover:bg-surface/5 transition-colors">
              <div className="w-12 h-12 bg-surface flex items-center justify-center text-primary rounded-xl">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-surface">Simple pricing</h3>
              <p className="text-surface/70 leading-relaxed text-sm md:text-base">No subscriptions. Pay as you go sessions starting at ₹250 per hour. Access quality support without long-term commitment.</p>
            </div>
            <div className="p-8 md:p-12 flex flex-col gap-4 md:gap-6 hover:bg-surface/5 transition-colors">
              <div className="w-12 h-12 bg-surface flex items-center justify-center text-primary rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-surface">Always online</h3>
              <p className="text-surface/70 leading-relaxed text-sm md:text-base">Connect with someone within 5 minutes, 24/7. Our network ensures support is available whenever you need it most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface to-surface-container-low -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary-container/10 to-transparent blur-[80px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <div className="w-20 h-1 bg-primary" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            <div className="bg-surface p-8 md:p-10 flex flex-col gap-6 md:gap-8 group hover:shadow-lg transition-shadow border border-on-surface/5">
              <div className="text-5xl md:text-6xl font-black text-primary/30 group-hover:text-primary/60 transition-colors">01</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Choose your match</h4>
                <p className="text-on-surface-variant leading-relaxed">Filter listeners by lived experience, language, and specialty to find the person who understands your journey.</p>
              </div>
            </div>
            <div className="bg-surface p-8 md:p-10 flex flex-col gap-6 md:gap-8 group hover:shadow-lg transition-shadow border border-on-surface/5">
              <div className="text-5xl md:text-6xl font-black text-primary/30 group-hover:text-primary/60 transition-colors">02</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Book a session</h4>
                <p className="text-on-surface-variant leading-relaxed">Choose an immediate &apos;Quick Connect&apos; or schedule a time that works for you. Private, encrypted, and anonymous.</p>
              </div>
            </div>
            <div className="bg-surface p-8 md:p-10 flex flex-col gap-6 md:gap-8 group hover:shadow-lg transition-shadow border border-on-surface/5">
              <div className="text-5xl md:text-6xl font-black text-primary/30 group-hover:text-primary/60 transition-colors">03</div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Get support</h4>
                <p className="text-on-surface-variant leading-relaxed">Connect via text, voice, or video. After your session, you only pay for the time you used. No strings attached.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — dark band */}
      <section className="py-14 sm:py-16 md:py-32 px-5 sm:px-6 md:px-8 bg-on-surface text-surface overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 sm:mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-[2rem] md:text-4xl font-bold tracking-tight mb-3 md:mb-4">Community stories</h2>
            <div className="w-20 h-1 bg-primary-container" />
          </div>
          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
              <p className="text-lg sm:text-2xl md:text-3xl font-medium leading-tight">
                &quot;I was struggling with returning to work after maternity leave and felt like nobody in my circle quite understood the guilt. Finding Sarah on Konfide changed everything. She&apos;d been through exactly the same thing 2 years ago.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-surface-container-high">
                  <Image src="/images/portrait_one_1774343011664.png" alt="Jessica W." fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold">Jessica W.</p>
                  <p className="text-xs sm:text-sm opacity-60">Marketing Director &amp; Mom</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
              <p className="text-lg sm:text-2xl md:text-3xl font-medium leading-tight">
                &quot;Therapy felt too clinical for what I was going through. I just needed to talk to another man who had dealt with high-pressure corporate burnout without feeling like a patient. Konfide gave me that space.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-surface-container-high">
                  <Image src="/images/portrait_five_1774343096442.png" alt="Tom B." fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold">Tom B.</p>
                  <p className="text-xs sm:text-sm opacity-60">Software Engineering Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
