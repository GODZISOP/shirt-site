"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ChevronDown, ArrowRight, X, Menu, Sparkles, ShoppingCart } from "lucide-react";
import logoImg from "../app/Shirt/image copy 20.png";
import { useCart } from "@/context/CartContext";
import CategoryIcon from "@/components/CategoryIcon";

interface ProductItem {
  name: string;
  sub: string;
  price: string;
  image: string;
  href: string;
}

interface ProductCategory {
  id: string;
  title: string;
  tagline: string;
  items: ProductItem[];
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "embroidery",
    title: "Embroidery",
    tagline: "High-density stitch & threading",
    items: [
      {
        name: "T-Shirts",
        sub: "Custom Thread Stitched",
        price: "From $11.99",
        image: "/shirt-front.png",
        href: "/design?cat=embroidery-tshirt",
      },
      {
        name: "Hats",
        sub: "3D Puff & Flat Stitch",
        price: "From $13.50",
        image: "/Shirt/landing-embroidered-patches.jpg",
        href: "/design?cat=embroidery-hat",
      },
    ],
  },
  {
    id: "print",
    title: "Print",
    tagline: "Direct-to-Film & Screen Print",
    items: [
      {
        name: "T-Shirts",
        sub: "Ultra-vibrant Full Color",
        price: "From $8.99",
        image: "/Shirt/florida-dtf-prints-services.png",
        href: "/design?cat=print-tshirt",
      },
      {
        name: "Hats",
        sub: "Seamless DTF Print",
        price: "From $10.99",
        image: "/Shirt/DTF-Xpress-print-finished-garment.jpg",
        href: "/design?cat=print-hat",
      },
    ],
  },
  {
    id: "laser",
    title: "Laser",
    tagline: "Precision engraved patches",
    items: [
      {
        name: "T-Shirts",
        sub: "Leather Patch Apparel",
        price: "From $14.50",
        image: "/Shirt/laser-engraved-leather-patches.webp",
        href: "/design?cat=laser-tshirt",
      },
      {
        name: "Hats",
        sub: "Laser Engraved Leather",
        price: "From $15.99",
        image: "/Shirt/laser-engraved-erie-pa-patch.webp",
        href: "/design?cat=laser-hat",
      },
    ],
  },
];

export default function Header() {
  const { cart } = useCart();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>("embroidery");
  const navContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 180);
  };

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setIsProductsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsProductsOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Links */}
          <div className="flex items-center gap-10" ref={navContainerRef}>
            <Link href="/" className="relative w-36 h-12 flex items-center shrink-0">
              <Image 
                src={logoImg} 
                alt="Demir Studio" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              
              {/* Products Trigger Button */}
              <div 
                className="relative py-7"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className={`group flex items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors py-1 ${
                    isProductsOpen ? "text-[#0070f3]" : "text-gray-900 hover:text-[#0070f3]"
                  }`}
                  aria-expanded={isProductsOpen}
                >
                  <span>Products</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-[#0070f3] ${isProductsOpen ? "rotate-180 text-[#0070f3]" : ""}`} />
                </button>

                {/* Ultra-Clean Modern Luxury Dropdown */}
                {isProductsOpen && (
                  <div 
                    className="absolute top-full -left-8 w-[780px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* 3 Clear Columns: Embroidery, Print, Laser */}
                    <div className="p-6 grid grid-cols-3 gap-6 bg-white">
                      {PRODUCT_CATEGORIES.map((cat, idx) => (
                        <div key={cat.id} className="flex flex-col">
                          
                          {/* Column Header */}
                          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100 mb-3.5">
                            <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0070f3] text-[11px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                              {cat.title}
                            </h3>
                          </div>

                          {/* Product Cards */}
                          <div className="flex flex-col gap-2.5">
                            {cat.items.map((item, itemIdx) => (
                              <Link
                                key={itemIdx}
                                href={item.href}
                                onClick={() => setIsProductsOpen(false)}
                                className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50/90 transition-all border border-transparent hover:border-gray-200/60"
                              >
                                {/* Thumbnail Image */}
                                <div className="relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-white group-hover:shadow-xs transition-all">
                                  <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-contain p-1 group-hover:scale-108 transition-transform duration-300" 
                                  />
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#0070f3] transition-colors leading-tight">
                                      {item.name}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-gray-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#0070f3] transition-all" />
                                  </div>
                                  <span className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                                    {item.sub}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                                    {item.price}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Category Quick Links */}
                    <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center gap-4 text-xs">
                      <span className="text-gray-400 font-medium">Browse:</span>
                      <Link href="/shirts" onClick={() => setIsProductsOpen(false)} className="inline-flex items-center gap-1.5 font-semibold text-gray-600 hover:text-[#0070f3] transition-colors">
                        <CategoryIcon category="shirts" size={13} />
                        <span>Shirts</span>
                      </Link>
                      <Link href="/hats" onClick={() => setIsProductsOpen(false)} className="inline-flex items-center gap-1.5 font-semibold text-gray-600 hover:text-[#0070f3] transition-colors">
                        <CategoryIcon category="hats" size={13} />
                        <span>Hats</span>
                      </Link>
                      <Link href="/shop" onClick={() => setIsProductsOpen(false)} className="inline-flex items-center gap-1.5 font-semibold text-gray-600 hover:text-[#0070f3] transition-colors">
                        <CategoryIcon category="all" size={13} />
                        <span>Shop All</span>
                      </Link>
                    </div>

                    {/* Clean Dropdown Footer Bar */}
                    <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#0070f3]" />
                        <span>Interactive 3D Preview Available for All Styles</span>
                      </div>
                      <Link 
                        href="/design" 
                        onClick={() => setIsProductsOpen(false)} 
                        className="font-bold text-[#0070f3] hover:text-blue-800 flex items-center gap-1 hover:underline"
                      >
                        Open Design Studio &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link 
                href="/design" 
                className="text-sm font-semibold text-gray-700 hover:text-[#0070f3] transition-colors"
              >
                Design Studio
              </Link>
              <Link 
                href="/shop" 
                className="text-sm font-semibold text-gray-700 hover:text-[#0070f3] transition-colors"
              >
                Shop
              </Link>
              <Link 
                href="/track-order" 
                className="text-sm font-semibold text-gray-700 hover:text-[#0070f3] transition-colors"
              >
                Track Order
              </Link>
            </nav>
          </div>

          {/* Right: Phone & Blue Start Designing Button */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="tel:5045643000" className="flex items-center gap-2.5 text-gray-700 hover:text-[#0070f3] transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0070f3]">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-tight">504 564 3000</span>
                <span className="text-[10px] text-gray-400 leading-tight">Direct Hotline</span>
              </div>
            </Link>

            <Link href="/checkout" className="relative p-2 text-gray-700 hover:text-[#0070f3] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#0070f3] border-2 border-white rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Vibrant Blue Start Designing Button */}
            <Link
              href="/design"
              className="px-7 py-3 rounded-full bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-bold tracking-wide shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Designing
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link href="/checkout" className="relative p-2 text-gray-700 hover:text-[#0070f3] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#0070f3] border-2 border-white rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link
              href="/design"
              className="px-4 py-2 rounded-full bg-[#0070f3] text-white text-xs font-bold shadow-sm"
            >
              Design Now
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="flex flex-col gap-4">
            
            {/* Products Accordion */}
            <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                Products Catalog
              </span>

              <div className="flex flex-col gap-2">
                {PRODUCT_CATEGORIES.map((cat, idx) => {
                  const isOpen = mobileCategoryOpen === cat.id;
                  return (
                    <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMobileCategoryOpen(isOpen ? null : cat.id)}
                        className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-gray-900"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0070f3] text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{cat.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-[#0070f3]" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 flex flex-col gap-2 border-t border-gray-50">
                          {cat.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs font-medium text-gray-800 hover:bg-blue-50 hover:text-[#0070f3] transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                  <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900">{item.name}</span>
                                  <span className="text-[10px] text-gray-500">{item.sub}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600">{item.price}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Quick Links (Mobile) */}
            <div className="flex gap-2 flex-wrap px-1">
              <Link href="/shirts" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-xs font-bold text-[#0070f3]">
                <CategoryIcon category="shirts" size={14} />
                <span>Shirts</span>
              </Link>
              <Link href="/hats" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-xs font-bold text-[#0070f3]">
                <CategoryIcon category="hats" size={14} />
                <span>Hats</span>
              </Link>
            </div>

            {/* Other Mobile Links */}
            <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
              <Link
                href="/design"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-sm font-semibold text-gray-800 hover:text-[#0070f3] rounded-lg hover:bg-gray-50"
              >
                Design Studio
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-sm font-semibold text-gray-800 hover:text-[#0070f3] rounded-lg hover:bg-gray-50"
              >
                Shop
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-sm font-semibold text-gray-800 hover:text-[#0070f3] rounded-lg hover:bg-gray-50"
              >
                Track Order
              </Link>
            </div>

            {/* Contact & Blue CTA */}
            <div className="flex flex-col gap-3">
              <Link
                href="tel:5045643000"
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl"
              >
                <Phone className="w-3.5 h-3.5 text-[#0070f3]" />
                <span>Call 504 564 3000</span>
              </Link>
              <Link
                href="/design"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3.5 bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transition-all"
              >
                Open Design Studio
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
