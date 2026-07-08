import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 flex justify-center">
      <div className="max-w-[1440px] w-full px-4 lg:px-[30px] flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-[var(--color-dark-blue)] font-roboto-slab tracking-tighter">
            <div className="w-6 h-6 bg-blue-400 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs">oo</span>
            </div>
            ooShirts
          </Link>
          <nav aria-label="Footer navigation" className="hidden lg:flex items-center gap-6 text-[var(--color-dark-text)]">
            <Link href="#" className="text-xs font-medium hover:text-[var(--color-primary)]">
              Products
            </Link>
            <Link href="#" className="text-xs font-medium hover:text-[var(--color-primary)]">
              Retrieve Design
            </Link>
            <Link href="#" className="text-xs font-medium hover:text-[var(--color-primary)]">
              Track Order
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="#" className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <p className="text-[var(--color-dark-text)] text-xs font-bold">Live Chat Now</p>
              <p className="text-[var(--color-dark-text)]/70 text-[10px]">Talk with an expert</p>
            </div>
          </Link>

          <Link href="tel:8882571918" className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <p className="text-[var(--color-dark-text)] text-xs font-bold">(888) 257-1918</p>
              <p className="text-[var(--color-dark-text)]/70 text-[10px]">Phone Number</p>
            </div>
          </Link>

          <Link
            href="#"
            className="px-4 py-2 rounded-full border border-gray-300 text-[var(--color-dark-text)] text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Start Designing
          </Link>
        </div>

      </div>
    </footer>
  );
}
