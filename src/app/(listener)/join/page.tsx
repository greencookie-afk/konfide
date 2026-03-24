import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Clock, Heart, Banknote, ShieldCheck, ClipboardEdit, Video } from "lucide-react";

export default function JoinPage() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-surface">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 md:px-8 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-center">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center">
              <span className="text-secondary font-bold tracking-widest text-xs mb-4 uppercase">Join the community</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-[1.1] mb-4 tracking-tight">
                Earn by <br /> <span className="text-primary">Listening</span>
              </h1>
              <p className="text-base text-on-surface-variant max-w-md mb-6 leading-relaxed font-light">
                Become a professional listener and make a meaningful impact part-time. Your empathy is more valuable than you think.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth?mode=signup&role=listen" className="bg-primary text-on-surface px-6 py-3 font-bold text-center hover:opacity-95 transition-all rounded-none shadow-md hover:shadow-lg">
                  Start your application
                </Link>
                <Link href="#requirements" className="bg-surface-container text-on-surface px-6 py-3 font-bold text-center hover:bg-surface-container-high transition-all rounded-none">
                  View requirements
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-[28px] md:rounded-[40px] bg-surface-container-low shadow-xl ring-1 ring-black/5">
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

        {/* Why Listen Section */}
        <section className="bg-surface-container-low py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Why listen?</h2>
              <div className="w-20 h-1 bg-primary"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary-container/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Flexible hours</h3>
                <p className="text-on-surface-variant leading-relaxed">Set your own availability. Listen when it fits your schedule, whether it&apos;s early mornings or late nights.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary-container/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Meaningful impact</h3>
                <p className="text-on-surface-variant leading-relaxed">Provide critical emotional support to those who need to be heard. Every session changes a life.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary-container/30 rounded-xl flex items-center justify-center">
                  <Banknote className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Extra income</h3>
                <p className="text-on-surface-variant leading-relaxed">Turn your natural empathy into a rewarding side income. Competitive hourly rates paid directly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="requirements" className="py-16 px-6 md:px-8 max-w-7xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-container/10 via-transparent to-transparent blur-[120px] rounded-full -z-10" />

          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Three steps to get started</h2>
            <p className="text-on-surface-variant text-sm md:text-base">Our application process is simple, thorough, and supportive to ensure quality for our users.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest p-8 relative rounded-2xl shadow-sm border border-on-surface/5 hover:border-primary/20 hover:shadow-md transition-all">
              <span className="text-5xl font-black text-surface-container-highest absolute top-6 right-6 mix-blend-multiply opacity-50">01</span>
              <div className="relative z-10 pt-4">
                <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-on-surface-variant"><ClipboardEdit className="w-5 h-5"/></div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">Apply online</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">Fill out a 10-minute application sharing your background and why you want to listen.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest p-8 relative rounded-2xl shadow-sm border border-on-surface/5 hover:border-primary/20 hover:shadow-md transition-all">
              <span className="text-5xl font-black text-surface-container-highest absolute top-6 right-6 mix-blend-multiply opacity-50">02</span>
              <div className="relative z-10 pt-4">
                <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-on-surface-variant"><Video className="w-5 h-5"/></div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">Quick interview</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">A brief video call to meet our team and demonstrate your active listening skills securely.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest p-8 relative rounded-2xl shadow-sm border border-on-surface/5 hover:border-primary/20 hover:shadow-md transition-all">
              <span className="text-5xl font-black text-surface-container-highest absolute top-6 right-6 mix-blend-multiply opacity-50">03</span>
              <div className="relative z-10 pt-4">
                <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-on-surface-variant"><ShieldCheck className="w-5 h-5"/></div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">Complete training</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">Access our expert-led modules on empathy, ethics, and supportive communication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 px-6 md:px-8 bg-on-surface text-surface overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-12">
              <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-4">Voices from our listeners</h2>
              <div className="w-20 h-1 bg-primary-container"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div className="flex flex-col gap-8">
                <p className="text-xl md:text-2xl font-medium leading-tight">
                  &quot;Being a listener has given me a sense of purpose I didn&apos;t find in my desk job. I feel truly connected to the world.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden bg-surface-container-high">
                    <Image alt="Sarah M." className="object-cover" fill sizes="48px" src="/images/stitch_sarah.png" />
                  </div>
                  <div>
                    <p className="font-bold">Sarah M.</p>
                    <p className="text-sm opacity-60">Listener since 2022</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <p className="text-xl md:text-2xl font-medium leading-tight">
                  &quot;The flexibility allows me to be there for my kids while still making a difference. It&apos;s the perfect balance of income and impact.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden bg-surface-container-high">
                    <Image alt="David R." className="object-cover" fill sizes="48px" src="/images/stitch_david.png" />
                  </div>
                  <div>
                    <p className="font-bold">David R.</p>
                    <p className="text-sm opacity-60">Listener since 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-6 md:px-8 bg-surface-container-low text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to make a difference?</h2>
            <p className="text-base md:text-lg text-on-surface-variant font-light mb-8">We are looking for compassionate individuals who believe in the power of a safe space.</p>
            <Link href="/auth?mode=signup&role=listen" className="inline-block bg-primary text-on-surface px-8 py-4 font-bold text-base md:text-lg hover:opacity-90 transition-all rounded-none shadow-lg hover:scale-[1.02]">
              Apply Now
            </Link>
            <p className="mt-6 text-sm text-on-surface-variant/60 font-medium uppercase tracking-widest">Takes about 10 minutes</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
