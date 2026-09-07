"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  PackageCheck, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  MessageCircle,
  Layers,
  Flame,
  Shirt,
  Tag,
  Scissors,
  Printer,
  ArrowRight
} from "lucide-react";
import BaseballCapIcon from "@/components/icons/BaseballCapIcon";
import { createQuote } from "@/lib/supabase";

export default function BulkOrderPage() {
  // Calculator state
  const [product, setProduct] = useState<"tshirt" | "hat" | "hoodie">("tshirt");
  const [technique, setTechnique] = useState<"print" | "embroidery" | "laser">("print");
  const [quantity, setQuantity] = useState<number>(50);

  // RFQ Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    qty: "50",
    productType: "Custom T-Shirts",
    method: "Direct-to-Film Print",
    deadline: "",
    notes: ""
  });

  // Calculate pricing based on volume
  const getBaseUnitPrice = () => {
    let base = 12.0;
    if (product === "hat") base = 14.5;
    if (product === "hoodie") base = 26.0;

    if (technique === "embroidery") base += 3.0;
    if (technique === "laser") base += 4.5;

    // Volume discount tiers
    if (quantity >= 250) return base * 0.50; // 50% off
    if (quantity >= 100) return base * 0.60; // 40% off
    if (quantity >= 50) return base * 0.70;  // 30% off
    if (quantity >= 25) return base * 0.80;  // 20% off
    if (quantity >= 12) return base * 0.90;  // 10% off
    return base;
  };

  const unitPrice = getBaseUnitPrice();
  const totalPrice = unitPrice * quantity;
  const singleItemBase = (product === "tshirt" ? 12 : product === "hat" ? 14.5 : 26) + 
                         (technique === "embroidery" ? 3 : technique === "laser" ? 4.5 : 0);
  const totalSavings = (singleItemBase * quantity) - totalPrice;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    try {
      await createQuote({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        product_type: formData.productType,
        technique: formData.method,
        quantity: formData.qty,
        notes: `Delivery deadline: ${formData.deadline || 'Flexible'}. Notes: ${formData.notes || 'None'}`
      });
    } catch (err) {
      console.warn("Could not save quote to remote Supabase:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F9]">
      <Header />

      <main className="flex-1 w-full pb-20">
        {/* Hero Section matching Homepage Aesthetic */}
        <section className="w-full bg-[var(--color-hero-bg)] py-14 lg:py-20 px-4 flex justify-center border-b border-[#9fc9eb]/50">
          <div className="max-w-[1280px] w-full flex flex-col items-center text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-light-blue)] gap-2 mb-4">
              <Tag className="w-4 h-4 text-[var(--color-dark-blue)]" />
              <span className="font-semibold text-xs md:text-sm text-[var(--color-dark-blue)]">
                Wholesale & Volume Pricing Guaranteed
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab tracking-tight leading-tight max-w-4xl">
              Bulk Custom Apparel & Hats For Less
            </h1>

            <p className="mt-4 text-base md:text-xl text-[var(--color-dark-text)] max-w-2xl font-normal">
              Equip your business, team, or event with Screen Print, 3D Embroidery, and Laser Engraved Patches with tiered savings up to 50% OFF.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a 
                href="#rfq-form"
                className="py-3.5 px-8 rounded-full bg-[var(--color-primary)] text-white text-base font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-md"
              >
                Request Custom Quote
              </a>
              <a 
                href="https://wa.me/15045643000?text=Hi%2C%20I%20am%20interested%20in%20a%20bulk%20quote%20for%20custom%20apparel."
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-8 rounded-full bg-white text-[var(--color-dark-text)] border border-gray-300 text-base font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp
              </a>
            </div>

          </div>
        </section>

        {/* Stats Strip matching Homepage stats-bg (#F8F9ED) */}
        <div className="w-full bg-[var(--color-stats-bg)] border-b border-[#e9ecd8] py-6 px-4">
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <TrendingDown className="w-6 h-6 text-[var(--color-primary)] mb-1" />
              <span className="font-bold text-[var(--color-dark-blue)] text-sm">Tiered Discounts</span>
              <span className="text-xs text-gray-500">Up to 50% OFF on 250+ units</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="font-bold text-[var(--color-dark-blue)] text-sm">Free Digital Proofs</span>
              <span className="text-xs text-gray-500">Approve before production</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 text-indigo-600 mb-1" />
              <span className="font-bold text-[var(--color-dark-blue)] text-sm">Fast Turnaround</span>
              <span className="text-xs text-gray-500">Rush delivery available</span>
            </div>
            <div className="flex flex-col items-center">
              <PackageCheck className="w-6 h-6 text-amber-600 mb-1" />
              <span className="font-bold text-[var(--color-dark-blue)] text-sm">Free Bulk Shipping</span>
              <span className="text-xs text-gray-500">On wholesale quantities</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Calculator & RFQ Form */}
        <div className="max-w-[1280px] mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interactive Calculator (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xl text-[var(--color-dark-blue)] font-roboto-slab">
                  Instant Price Estimator
                </h3>
                <span className="text-xs font-semibold px-3 py-1 bg-[var(--color-light-blue)]/50 text-[var(--color-dark-blue)] rounded-full">
                  Live Calculator
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Select your garment, decoration method, and quantity to see live bulk volume pricing.
              </p>

              {/* 1. Select Garment */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  1. Select Garment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProduct("tshirt")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      product === "tshirt" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <Shirt className="w-5 h-5" />
                    <span>T-Shirts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProduct("hat")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      product === "hat" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <BaseballCapIcon size={20} />
                    <span>Caps / Hats</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProduct("hoodie")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      product === "hoodie" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                    <span>Hoodies</span>
                  </button>
                </div>
              </div>

              {/* 2. Decoration Method */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  2. Decoration Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTechnique("print")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      technique === "print" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>Direct Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTechnique("embroidery")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      technique === "embroidery" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Embroidery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTechnique("laser")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      technique === "laser" 
                        ? "border-[var(--color-primary)] bg-blue-50/70 text-[var(--color-primary)]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Laser Patch</span>
                  </button>
                </div>
              </div>

              {/* 3. Quantity Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    3. Quantity Needed
                  </label>
                  <span className="text-sm font-bold text-[var(--color-primary)] bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                    {quantity} units
                  </span>
                </div>
                <input 
                  type="range"
                  min="12"
                  max="500"
                  step="6"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-1.5">
                  <span>12 min</span>
                  <span>50 pcs</span>
                  <span>100 pcs</span>
                  <span>250 pcs</span>
                  <span>500+</span>
                </div>
              </div>

              {/* Tier Savings Progress */}
              <div className="bg-[#F8F9F9] rounded-xl p-3.5 border border-gray-200 mb-5">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2">
                  Volume Discount Progress
                </span>
                <div className="space-y-1 text-xs">
                  <div className={`flex justify-between py-1 px-2 rounded-lg ${quantity >= 250 ? 'bg-blue-100 text-[var(--color-dark-blue)] font-bold' : 'text-gray-600'}`}>
                    <span>250+ units</span>
                    <span>50% OFF</span>
                  </div>
                  <div className={`flex justify-between py-1 px-2 rounded-lg ${quantity >= 100 && quantity < 250 ? 'bg-blue-100 text-[var(--color-dark-blue)] font-bold' : 'text-gray-600'}`}>
                    <span>100 – 249 units</span>
                    <span>40% OFF</span>
                  </div>
                  <div className={`flex justify-between py-1 px-2 rounded-lg ${quantity >= 50 && quantity < 100 ? 'bg-blue-100 text-[var(--color-dark-blue)] font-bold' : 'text-gray-600'}`}>
                    <span>50 – 99 units</span>
                    <span>30% OFF</span>
                  </div>
                  <div className={`flex justify-between py-1 px-2 rounded-lg ${quantity >= 25 && quantity < 50 ? 'bg-blue-100 text-[var(--color-dark-blue)] font-bold' : 'text-gray-600'}`}>
                    <span>25 – 49 units</span>
                    <span>20% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Output */}
            <div className="border-t border-gray-100 pt-5 mt-2">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-gray-600 text-sm font-medium">Estimated Per Unit:</span>
                <span className="text-3xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab">
                  ${unitPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-gray-500 text-xs">Estimated Total:</span>
                <span className="text-lg font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Total Savings:
                  </span>
                  <span>Save ${totalSavings.toFixed(2)}</span>
                </div>
              )}

              <Link
                href={`/design?product=${product}&method=${technique}&qty=${quantity}`}
                className="mt-5 w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Customize in Design Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Official Request for Quote (RFQ) Form (7 cols) */}
          <div id="rfq-form" className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
            {formSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-dark-blue)] font-roboto-slab mb-2">
                  Quote Request Received!
                </h3>
                <p className="text-gray-600 text-sm max-w-md mb-6">
                  Thank you, <strong>{formData.name || "Customer"}</strong>. Our dedicated bulk apparel specialists are reviewing your request and will send an official proof & quote within 2-4 hours.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                  >
                    Submit Another Quote
                  </button>
                  <a
                    href="https://wa.me/15045643000?text=Hi%2C%20I%20just%20submitted%20a%20bulk%20quote%20request%20online!"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" /> Expedite on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-light-blue)] gap-1.5 mb-2">
                    <Tag className="w-3 h-3 text-[var(--color-dark-blue)]" />
                    <span className="text-[11px] font-bold text-[var(--color-dark-blue)] uppercase tracking-wider">Fast Turnaround</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab">
                    Get an Official Written Quote
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Have custom artwork, specific blank garments, or exact specs? Fill out this quick form and our art team will prepare a digital proof.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="michael@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Company or Event Name</label>
                    <input
                      type="text"
                      placeholder="Acme Corp / Varsity 2026"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Apparel Type</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({...formData, productType: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option>Custom T-Shirts</option>
                      <option>Custom Caps & Hats</option>
                      <option>Custom Hoodies & Fleeces</option>
                      <option>Long Sleeves & Polos</option>
                      <option>Mix of Multiple Items</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Decoration</label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData({...formData, method: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option>Direct-to-Film (Print)</option>
                      <option>Custom 3D Embroidery</option>
                      <option>Laser Engraved Leather Patch</option>
                      <option>Screen Printing</option>
                      <option>Not sure - advise me</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Approx. Quantity</label>
                    <input
                      type="text"
                      placeholder="e.g. 100"
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Attach Logo or Artwork (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <input type="file" className="hidden" id="bulk-art-upload" />
                    <label htmlFor="bulk-art-upload" className="cursor-pointer">
                      <span className="text-xs font-bold text-[var(--color-primary)]">Click to upload design</span>
                      <span className="text-xs text-gray-400 block mt-0.5">PNG, JPG, PDF, SVG, AI, or EPS up to 25MB</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Special Instructions or Delivery Deadline</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about specific garment colors, sizes, placement, or urgent delivery dates..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Bulk Quote Request
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  100% Free • No obligation • Price match guarantee • Responses within 2 hours
                </p>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
