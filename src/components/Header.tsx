"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-white border-b border-gray-200">
      <div className="flex h-full w-full items-center justify-between px-4 lg:px-[30px] py-4 lg:py-5 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-[var(--color-dark-blue)] font-roboto-slab tracking-tighter">
            ooShirts
          </Link>
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-9 text-[var(--color-dark-text)]">
            <button className="text-sm font-medium leading-[21px] cursor-pointer hover:text-[var(--color-primary)] transition-colors">
              Products
            </button>
            <Link href="#" className="text-sm font-medium leading-[21px] hover:text-[var(--color-primary)] transition-colors">
              Retrieve Design
            </Link>
            <Link href="#" className="text-sm font-medium leading-[21px] hover:text-[var(--color-primary)] transition-colors">
              Track Order
            </Link>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-[54px]">
          <Link href="#" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <MessageCircle className="w-8 h-8 text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <p className="text-[var(--color-dark-text)] text-base font-bold leading-[21px]">
                Live Chat Now
              </p>
              <p className="text-[var(--color-dark-text)]/70 text-xs leading-[21px]">
                Talk with an expert
              </p>
            </div>
          </Link>
          <Link href="tel:8882571918" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Phone className="w-8 h-8 text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <p className="text-[var(--color-dark-text)] text-base font-bold leading-[21px]">
                (888) 257-1918
              </p>
              <p className="text-[var(--color-dark-text)]/70 text-xs leading-[21px]">
                Phone Number
              </p>
            </div>
          </Link>
          <Link
            href="#"
            className="px-6 py-3 rounded-full bg-white border border-[var(--color-dark-blue)] text-[var(--color-dark-blue)] text-sm font-medium leading-[21px] hover:bg-[var(--color-stats-bg)] transition-colors"
          >
            Start Designing
          </Link>
        </div>

        <button
          type="button"
          className="flex lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-[var(--color-dark-text)]" />
          ) : (
            <Menu className="w-6 h-6 text-[var(--color-dark-text)]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-md">
          <div className="flex flex-col p-4 gap-4">
            <Link href="#" className="text-lg font-medium text-[var(--color-dark-text)] border-b pb-2">
              Products
            </Link>
            <Link href="#" className="text-lg font-medium text-[var(--color-dark-text)] border-b pb-2">
              Retrieve Design
            </Link>
            <Link href="#" className="text-lg font-medium text-[var(--color-dark-text)] border-b pb-2">
              Track Order
            </Link>
            <div className="flex flex-col gap-4 mt-4">
              <Link href="#" className="flex items-center gap-4">
                <MessageCircle className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="font-bold">Live Chat Now</span>
              </Link>
              <Link href="tel:8882571918" className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="font-bold">(888) 257-1918</span>
              </Link>
            </div>
            <Link
              href="#"
              className="mt-4 px-6 py-3 text-center rounded-full bg-[var(--color-primary)] text-white font-medium w-full"
            >
              Start Designing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
