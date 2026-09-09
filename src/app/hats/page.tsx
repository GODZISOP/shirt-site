"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles } from "lucide-react";
import { TECHNIQUE_INFO, type Technique } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { useState, useMemo } from "react";

export default function HatsPage() {
  const { products } = useProducts();
  const hatProducts = useMemo(() => products.filter((p) => p.category === "hats"), [products]);
  const [activeTech, setActiveTech] = useState<Technique | "all">("all");

  const filtered = useMemo(() => {
    if (activeTech === "all") return hatProducts;
    return hatProducts.filter((p) => p.techniques.includes(activeTech));
  }, [hatProducts, activeTech]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9f9]">
      <Header />

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold mb-6">
              <Sparkles size={16} /> Custom Caps & Hats
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-roboto-slab tracking-tight mb-4 leading-tight">
              Custom Caps<br />& Hats
            </h1>
            <p className="text-blue-200 text-lg max-w-md mb-8">
              3D puff embroidery, vibrant DTF prints, and premium laser-engraved leather patches on quality caps.
            </p>
            <Link
              href="/design?product=hat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[var(--color-primary)] font-bold hover:bg-blue-50 transition-colors shadow-xl"
            >
              Design Your Hat <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/hat-front.png"
              alt="Custom Hats"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Technique Filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-sm font-semibold text-slate-500">Filter by technique:</span>
          <button
            onClick={() => setActiveTech("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTech === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          {(Object.keys(TECHNIQUE_INFO) as Technique[]).map((tech) => {
            const info = TECHNIQUE_INFO[tech];
            return (
              <button
                key={tech}
                onClick={() => setActiveTech(activeTech === tech ? "all" : tech)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTech === tech
                    ? "text-white"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
                style={activeTech === tech ? { background: info.color } : {}}
              >
                {info.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-[var(--color-primary)] shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {product.techniques.map((tech) => (
                    <span key={tech} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: TECHNIQUE_INFO[tech].color, background: TECHNIQUE_INFO[tech].bg }}>
                      {TECHNIQUE_INFO[tech].label}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-emerald-600">From ${product.priceFrom.toFixed(2)}</span>
                  <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Design <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
