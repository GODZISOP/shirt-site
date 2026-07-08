import Link from "next/link";
import { Tag, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full bg-[var(--color-hero-bg)] py-12 lg:py-20 flex justify-center">
      <div className="max-w-[1440px] w-full px-4 lg:px-[30px] grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-7 lg:pl-[30px]">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-light-blue)] w-fit gap-2">
              <Tag className="w-5 h-5 text-[var(--color-dark-blue)]" />
              <p className="font-semibold text-[var(--color-dark-blue)]">
                Lowest prices guaranteed
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab tracking-tight leading-tight max-w-[600px]">
              Custom T-Shirts For Less
            </h1>
          </div>
          
          <div className="flex flex-col gap-6">
            <p className="text-lg md:text-xl text-[var(--color-dark-text)] max-w-[500px]">
              Design your own custom t-shirts and save.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Link
                href="#"
                className="py-4 px-10 text-center rounded-full bg-[var(--color-primary)] text-white text-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Get Started
              </Link>
              <div className="text-[var(--color-dark-text)] text-lg font-medium text-center sm:text-left">
                or{" "}
                <Link href="#" className="underline hover:text-[var(--color-primary)]">
                  Get a Quick Quote
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <div className="flex gap-1 text-[var(--color-primary)]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[var(--color-dark-text)] font-medium">
                4.8/5 based on{" "}
                <Link href="#" className="underline hover:text-[var(--color-primary)]">
                  12,370 reviews
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Image (Placeholder for now, using a stylized div to look premium) */}
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-white/40 rounded-3xl backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-xl relative overflow-hidden">
          {/* We would use an actual next/image here in production */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent"></div>
          <div className="relative z-10 text-center flex flex-col items-center gap-4">
             <div className="w-32 h-32 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center animate-pulse">
                <Tag className="w-16 h-16 text-[var(--color-primary)]" />
             </div>
             <p className="text-[var(--color-dark-blue)] font-bold text-xl font-roboto-slab">T-Shirt Mockup Area</p>
          </div>
        </div>
      </div>
    </section>
  );
}
