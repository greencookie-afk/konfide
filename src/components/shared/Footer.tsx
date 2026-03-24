import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-12 sm:py-16 md:py-20 px-5 sm:px-8 border-t-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-20">
          <div className="flex flex-col gap-5 sm:gap-6 max-w-sm">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface">
              Konfide
            </Link>
            <p className="text-xs sm:text-base text-on-surface-variant leading-relaxed">
              Redefining mental health support through peer-to-peer connection and lived experience.
            </p>
          </div>

          <div className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8 sm:gap-x-14 md:gap-16">
            <div className="flex flex-col gap-3 sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Product</span>
              <Link href="/explore" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Find a Listener</Link>
              <Link href="/#how-it-works" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">How it works</Link>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Company</span>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Careers</Link>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm sm:text-base text-on-surface-variant hover:text-primary transition-colors">Safety Center</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 pt-8 sm:pt-10 md:pt-12 border-t border-on-surface/10">
          <p className="text-[10px] sm:text-sm uppercase tracking-[0.18em] sm:tracking-widest text-on-surface/50 text-center md:text-left">
            © {new Date().getFullYear()} Konfide. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
            <Link href="#" className="text-on-surface/50 hover:text-primary transition-colors text-[10px] sm:text-sm uppercase tracking-[0.18em] sm:tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-on-surface/50 hover:text-primary transition-colors text-[10px] sm:text-sm uppercase tracking-[0.18em] sm:tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
