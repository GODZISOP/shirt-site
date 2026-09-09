"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryIcon from "@/components/CategoryIcon";
import { useProducts } from "@/lib/useProducts";
import { CATEGORY_INFO } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart, Sparkles, Check, ArrowRight, ShieldCheck,
  Truck, Clock, ChevronRight, Star, Heart, Share2, Plus, Minus
} from "lucide-react";

const AVAILABLE_COLORS = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Heather Grey", hex: "#9ca3af" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Crimson Red", hex: "#dc2626" },
];

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products } = useProducts();
  const { addToCart } = useCart();

  const product = useMemo(() => {
    return products.find((p) => p.id === productId);
  }, [products, productId]);

  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const productImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const activeImage = productImages[activeImgIndex] || product?.image || "/Shirt/florida-dtf-prints-services.png";

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f9]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#003CC7] flex items-center justify-center mb-4">
            <CategoryIcon category="shirts" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6 max-w-sm">The product you are looking for might have been moved or is currently unavailable.</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const unitPrice = product.priceFrom;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      productName: product.name,
      productId: product.id,
      category: product.category,
      shirtColor: selectedColor.name,
      quantities: { [selectedSize]: quantity },
      pricePerShirt: unitPrice,
      totalPrice: totalPrice,
      frontImage: activeImage,
      productType: product.category === "hats" ? "hat" : (product.category === "jeans" ? "jeans" : "tshirt"),
      technique: (product.techniques?.[0] || "print") as any,
      isCustomDesign: false,
    });

    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 4500);
  };

  const handleCustomize = () => {
    const pType = product.category === "hats" ? "hat" : "tshirt";
    router.push(`/design?product=${pType}&color=${encodeURIComponent(selectedColor.name.toLowerCase())}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f9]">
      <Header />

      {/* Added to Cart Floating Banner */}
      {addedNotification && (
        <div className="fixed top-24 right-4 z-50 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Check size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900">Added to your cart!</h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {product.name} ({selectedColor.name}, Size {selectedSize}, Qty: {quantity})
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Link
                  href="/checkout"
                  className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-colors inline-flex items-center gap-1.5"
                >
                  Checkout Now <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() => setAddedNotification(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <Link href="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <Link href={`/${product.category}`} className="hover:text-[var(--color-primary)] capitalize">
            {CATEGORY_INFO[product.category]?.label || product.category}
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Main Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
          
          {/* Left: Product Image & Badges */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-6 group">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-md">
                  {product.badge}
                </div>
              )}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[11px] font-semibold backdrop-blur-xs">
                  {activeImgIndex + 1} / {productImages.length}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 transition-all cursor-pointer ${
                      activeImgIndex === idx
                        ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-xs scale-105"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                <Truck className="w-5 h-5 text-[var(--color-primary)] mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Free Shipping</span>
                <span className="text-[10px] text-slate-500">Orders over $75</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                <Clock className="w-5 h-5 text-[var(--color-primary)] mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Fast Turnaround</span>
                <span className="text-[10px] text-slate-500">3-5 business days</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Premium Quality</span>
                <span className="text-[10px] text-slate-500">100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Buy Controls */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  <CategoryIcon category={product.category} size={14} />
                  {CATEGORY_INFO[product.category]?.label}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star size={14} className="fill-current" />
                  <span className="text-slate-700">4.9</span>
                  <span className="text-slate-400 font-normal">(184 reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-extrabold text-[var(--color-primary)] font-roboto-slab">
                  ${unitPrice.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ item</span>
                <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Stock & Ready
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}. Premium quality finish, soft-touch durable fabric, and comfortable unisex fit.
              </p>

              <hr className="border-slate-100 mb-6" />

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Color: <span className="font-semibold text-[var(--color-primary)]">{selectedColor.name}</span>
                  </label>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {AVAILABLE_COLORS.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[var(--color-primary)] ring-offset-2 scale-110 shadow-sm"
                            : "border-slate-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check
                            size={16}
                            strokeWidth={3}
                            className={color.hex === "#ffffff" ? "text-slate-900" : "text-white"}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Size: <span className="font-normal text-slate-600">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Standard Unisex Fit</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Quantity Counter */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-base font-bold text-slate-900 w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Customize */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                <span className="text-xl font-bold text-slate-900 font-roboto-slab">${totalPrice}</span>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={18} />
                Add to Cart (${totalPrice})
              </button>

              {/* Customize Button */}
              <button
                type="button"
                onClick={handleCustomize}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-blue-50 text-[var(--color-primary)] border-2 border-[var(--color-primary)] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                Customize in 3D Design Studio
              </button>
            </div>
          </div>
        </div>

        {/* Wholesale Bulk Tier Table */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base font-bold text-slate-900">Bulk Quantity Pricing Available</h3>
            <span className="text-xs text-slate-500">Discounts apply automatically at checkout</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-500">1 - 24 Pieces</div>
              <div className="text-sm font-bold text-slate-900 mt-1">${unitPrice.toFixed(2)} / ea</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Standard</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="text-xs font-semibold text-[var(--color-primary)]">25 - 49 Pieces</div>
              <div className="text-sm font-bold text-[var(--color-primary)] mt-1">${(unitPrice * 0.9).toFixed(2)} / ea</div>
              <div className="text-[10px] font-semibold text-blue-600 mt-0.5">10% OFF</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="text-xs font-semibold text-[var(--color-primary)]">50 - 99 Pieces</div>
              <div className="text-sm font-bold text-[var(--color-primary)] mt-1">${(unitPrice * 0.82).toFixed(2)} / ea</div>
              <div className="text-[10px] font-semibold text-blue-600 mt-0.5">18% OFF</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-700">100+ Pieces</div>
              <div className="text-sm font-bold text-emerald-700 mt-1">${(unitPrice * 0.75).toFixed(2)} / ea</div>
              <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">25% OFF</div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-roboto-slab">
                More in {CATEGORY_INFO[product.category]?.label || "This Collection"}
              </h3>
              <Link href={`/${product.category}`} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/${rel.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">{rel.description}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--color-primary)] font-roboto-slab">
                        From ${rel.priceFrom.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-[var(--color-primary)] flex items-center gap-0.5">
                        View <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
