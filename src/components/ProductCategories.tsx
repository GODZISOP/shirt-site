"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const initialCategories = [
  { name: "Custom Shirts", items: 3, top: true, image: "/Shirt/florida-dtf-prints-services.png" },
  { name: "Custom Hoodies", items: 3, top: true, image: "/Shirt/image.png" },
  { name: "Custom Sweatshirts", items: 3, top: true, image: "/Shirt/image copy.png" },
  { name: "Youth Tees", items: 5, top: false, image: "/Shirt/image copy 5.png" },
  { name: "Performance Styles", items: 5, top: false, image: "/Shirt/il_800x800.7169952703_agqz.webp" },
  { name: "Long Sleeve Shirts", items: 5, top: false, image: "/Shirt/image copy 3.png" },
  { name: "Women Shirts", items: 5, top: false, image: "/Shirt/women.png" },
  { name: "Jackets", items: 5, top: false, image: "/Shirt/image copy 2.png" },
];

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ProductCategories() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const shuffle = () => {
      const shuffled = shuffleArray(initialCategories);
      // Ensure the first 3 items get the large "top" styling
      const updated = shuffled.map((cat, idx) => ({
        ...cat,
        top: idx < 3
      }));
      setCategories(updated);
    };

    // Initial shuffle on mount
    shuffle();

    // Shuffle every 6 seconds
    const interval = setInterval(shuffle, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white py-12 lg:py-24 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-8 lg:gap-12">
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center tracking-tight max-w-[600px]">
          Choose from a variety of t-shirt styles
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 w-full">
          {categories.map((cat, idx) => {
            return (
              <motion.div 
                layout
                key={cat.name} 
                initial={{ opacity: 0, y: 40, filter: "brightness(0)" }}
                whileInView={{ opacity: 1, y: 0, filter: "brightness(1)" }}
                transition={{
                  layout: { duration: 0.8, type: "spring", bounce: 0.2 },
                  opacity: { duration: 0.8, ease: "easeOut", delay: Math.floor(idx / 2) * 0.2 },
                  y: { duration: 0.8, ease: "easeOut", delay: Math.floor(idx / 2) * 0.2 },
                  filter: { duration: 0.8, ease: "easeOut", delay: Math.floor(idx / 2) * 0.2 }
                }}
                viewport={{ once: false, margin: "-50px" }}
                className={`flex flex-col items-center group cursor-pointer col-span-1 ${cat.top ? 'lg:col-span-2 lg:first:col-span-1 lg:[&:nth-child(2)]:col-span-2 lg:[&:nth-child(3)]:col-span-2' : ''}`}
              >
                <div className="w-full aspect-square bg-[#F8F9F9] rounded-2xl flex flex-col items-center justify-center mb-4 transition-transform group-hover:-translate-y-1 group-hover:shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                  <p className="absolute top-4 text-[var(--color-dark-blue)] font-bold text-xs md:text-sm z-20 bg-white/90 px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-sm backdrop-blur-sm">{cat.name}</p>
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
          <p className="text-sm text-gray-500 text-center max-w-[300px]">
            Join 1,000,000+ customers who have used Demir Studio to create custom printed t-shirts.
          </p>
          <Link
            href="#"
            className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-md"
          >
            Start Designing
          </Link>
        </div>

      </div>
    </section>
  );
}
