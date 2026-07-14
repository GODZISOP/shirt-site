import Link from "next/link";
import Image from "next/image";
import { Tag, Star } from "lucide-react";
import heroImg from "../app/Shirt/image copy 17.png";

export default function Hero() {
  return (
    <section className="w-full bg-[var(--color-hero-bg)] flex justify-center overflow-hidden">
      <div className="max-w-[1440px] w-full px-4 lg:px-[30px] grid lg:grid-cols-2 gap-10 items-stretch">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-7 lg:pl-[30px] py-12 lg:py-20">
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

        {/* Right Image */}
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[700px] relative flex items-end justify-center lg:justify-end">
          <Image 
            src={heroImg}
            alt="Custom Apparel"
            fill
            className="object-contain object-bottom lg:scale-110 lg:origin-bottom"
            priority
            unoptimized
          />
        </div>

      </div>
    </section>
  );
}
