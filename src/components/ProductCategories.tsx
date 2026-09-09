"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/lib/useProducts";

// Exactly 7 styles
const initialCategories = [
  { id: "custom-tshirts", name: "Custom Shirts", image: "/Shirt/florida-dtf-prints-services.png", href: "/design?product=tshirt" },
  { id: "custom-hoodies", name: "Custom Hoodies", image: "/Shirt/image.png", href: "/design?product=tshirt" },
  { id: "custom-sweatshirts", name: "Custom Sweatshirts", image: "/Shirt/image copy.png", href: "/design?product=tshirt" },
  { id: "youth-tees", name: "Youth Tees", image: "/Shirt/image copy 5.png", href: "/design?product=tshirt" },
  { id: "performance-styles", name: "Performance Styles", image: "/Shirt/il_800x800.7169952703_agqz.webp", href: "/design?product=tshirt" },
  { id: "long-sleeve-shirts", name: "Long Sleeve Shirts", image: "/Shirt/image copy 3.png", href: "/design?product=tshirt" },
  { id: "women-shirts", name: "Women Shirts", image: "/Shirt/women.png", href: "/design?product=tshirt" },
];

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ProductCategories() {
  const { products } = useProducts();

  // Combine products with live images/status from admin (Strictly MAX 7)
  const baseItems = useMemo(() => {
    // If admin has specifically enabled products for homepage
    const selected = products.filter((p) => p.showOnHomepage === true);
    if (selected.length > 0) {
      return selected.slice(0, 7).map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        href: p.href || `/shop/${p.id}`,
      }));
    }

    // Fallback: top 7 default categories with live images
    return initialCategories.slice(0, 7).map((cat) => {
      const match = products.find((p) => p.id === cat.id);
      return {
        id: cat.id,
        name: match?.name || cat.name,
        image: match?.image || cat.image,
        href: match?.href || cat.href,
      };
    });
  }, [products]);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const doShuffle = () => {
      const shuffled = shuffleArray(baseItems);
      setCategories(shuffled);
    };

    doShuffle();

    const interval = setInterval(doShuffle, 6000);
    return () => clearInterval(interval);
  }, [baseItems]);

  const displayList = categories.length > 0 ? categories : baseItems;

  return (
    <section className="w-full bg-white py-6 lg:py-12 flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-3 sm:px-6 lg:px-8 flex flex-col items-center gap-6 lg:gap-8">
        
        {/* Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center tracking-tight max-w-[650px]">
          Choose from a variety of t-shirt styles
        </h2>

        {/* 12-Column Responsive Layout: Row 1 = 3 Large Cards, Row 2 = 4 Normal Cards */}
        <div className="grid grid-cols-12 gap-3.5 md:gap-4.5 lg:gap-5 w-full">
          {displayList.map((cat, idx) => {
            // Row 1 (first 3 items): larger (col-span-4 on desktop = 1/3 each)
            // Row 2 (next 4 items): normal (col-span-3 on desktop = 1/4 each)
            const isTopRow = idx < 3;
            const colSpanClass = isTopRow
              ? "col-span-6 md:col-span-4"
              : "col-span-6 md:col-span-3";
            const aspectClass = isTopRow
              ? "aspect-[16/11]"
              : "aspect-[16/13] sm:aspect-square";

            return (
              <motion.div 
                layout
                key={cat.id || cat.name} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  layout: { duration: 0.8, type: "spring", bounce: 0.2 },
                  duration: 0.4,
                }}
                className={`group cursor-pointer ${colSpanClass}`}
              >
                <Link href={cat.href || "/design"} className="block w-full h-full">
                  <div className={`w-full ${aspectClass} bg-[#F8F9F9] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl relative overflow-hidden border border-slate-100/90`}>
                    
                    {/* Hover dark tint */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                    
                    {/* Title Pill Badge */}
                    <p className="absolute top-3.5 text-[var(--color-dark-blue)] font-bold text-xs md:text-sm z-20 bg-white/95 px-3.5 py-1.5 rounded-full shadow-xs backdrop-blur-xs text-center max-w-[85%] truncate">
                      {cat.name}
                    </p>
                    
                    {/* Product Image */}
                    <Image 
                      src={cat.image} 
                      alt={cat.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-sm text-gray-500 text-center max-w-[320px]">
            Join 1,000,000+ customers who have used Demir Studio to create custom printed t-shirts.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-md hover:shadow-lg"
          >
            Show Products
          </Link>
        </div>

      </div>
    </section>
  );
}
