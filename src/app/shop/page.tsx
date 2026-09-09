"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, X, SlidersHorizontal, ArrowRight, PackageSearch, Tag } from "lucide-react";
import { CATEGORY_INFO, TECHNIQUE_INFO, type ProductCategory, type Technique } from "@/lib/products";
import CategoryIcon from "@/components/CategoryIcon";
import { useProducts } from "@/lib/useProducts";

export default function ShopPage() {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [activeTechnique, setActiveTechnique] = useState<Technique | "all">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesTechnique = activeTechnique === "all" || p.techniques.includes(activeTechnique);
      return matchesSearch && matchesCategory && matchesTechnique;
    });
  }, [products, searchQuery, activeCategory, activeTechnique]);

  const categories: { key: ProductCategory | "all"; label: string }[] = [
    { key: "all", label: "All Products" },
    { key: "shirts", label: "Shirts" },
    { key: "hats", label: "Hats" },
    { key: "jeans", label: "Jeans" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9f9]">
      <Header />

      {/* Hero Banner with exact website signature brand styling */}
      <section className="w-full bg-[var(--color-hero-bg)] py-14 md:py-20 border-b border-[#9FC9EB]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-light-blue)] text-[var(--color-dark-blue)] text-xs font-bold mb-4 shadow-2xs">
            <Tag className="w-4 h-4 text-[var(--color-dark-blue)]" />
            <span>Direct Custom & Ready-Made Orders</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-roboto-slab text-[var(--color-dark-text)] tracking-tight mb-4 leading-tight">
            Shop All Products
          </h1>
          <p className="text-[var(--color-dark-text)]/80 text-base md:text-lg max-w-xl mx-auto">
            Browse our complete collection of custom apparel. Shirts, hoodies, hats, jeans & more — available ready-to-wear or custom printed.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 shadow-xl border border-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                <CategoryIcon category={cat.key} size={15} />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Technique Filter */}
          <div className="flex gap-2 flex-wrap sm:ml-auto">
            <button
              onClick={() => setActiveTechnique("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTechnique === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Techniques
            </button>
            {(Object.keys(TECHNIQUE_INFO) as Technique[]).map((tech) => {
              const info = TECHNIQUE_INFO[tech];
              return (
                <button
                  key={tech}
                  onClick={() => setActiveTechnique(activeTechnique === tech ? "all" : tech)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTechnique === tech
                      ? "text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                  style={activeTechnique === tech ? { background: info.color } : {}}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-400 mb-6">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0070f3] flex items-center justify-center mx-auto mb-3">
              <PackageSearch size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-[var(--color-primary)] shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {product.techniques.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: TECHNIQUE_INFO[tech].color,
                            background: TECHNIQUE_INFO[tech].bg,
                          }}
                        >
                          {TECHNIQUE_INFO[tech].label}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-sm font-bold text-emerald-600">
                      From ${product.priceFrom.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 mb-8">
          <p className="text-slate-500 text-sm mb-4">Can't find what you need?</p>
          <Link
            href="/bulk-order"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg"
          >
            Request a Custom Quote <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
