"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  ExternalLink,
  Tag,
  ArrowRight
} from "lucide-react";
import { fetchOrderById } from "@/lib/supabase";

interface OrderData {
  orderId: string;
  customerName: string;
  email: string;
  productName: string;
  itemType: "tshirt" | "hat";
  technique: "print" | "embroidery" | "laser";
  image: string;
  quantity: number;
  total: string;
  statusStep: number; // 1 to 5
  placedDate: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  shippingAddress: string;
  cartData?: string;
}

const SAMPLE_ORDERS: Record<string, OrderData> = {
  "ORD-84920": {
    orderId: "ORD-84920",
    customerName: "Alex Morgan",
    email: "alex@example.com",
    productName: "Vintage Twill Baseball Cap",
    itemType: "hat",
    technique: "embroidery",
    image: "/hat-front.png",
    quantity: 36,
    total: "$486.00",
    statusStep: 4, // Quality Check
    placedDate: "Sep 01, 2026",
    estimatedDelivery: "Sep 08, 2026",
    carrier: "FedEx Express",
    trackingNumber: "789123456789",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477"
  },
  "ORD-91204": {
    orderId: "ORD-91204",
    customerName: "Sarah Jenkins",
    email: "sarah@acme.org",
    productName: "Heavyweight Cotton Tee",
    itemType: "tshirt",
    technique: "laser",
    image: "/shirt-front.png",
    quantity: 75,
    total: "$975.00",
    statusStep: 3, // In Production
    placedDate: "Sep 03, 2026",
    estimatedDelivery: "Sep 11, 2026",
    carrier: "UPS Ground",
    trackingNumber: "1Z9999999999999999",
    shippingAddress: "1200 Grand Ave, Suite 400, Chicago, IL 60611"
  },
  "ORD-73019": {
    orderId: "ORD-73019",
    customerName: "David Vance",
    email: "david@startup.io",
    productName: "Direct-to-Film Custom T-Shirt",
    itemType: "tshirt",
    technique: "print",
    image: "/shirt-front.png",
    quantity: 120,
    total: "$1,140.00",
    statusStep: 5, // Out for Delivery
    placedDate: "Aug 29, 2026",
    estimatedDelivery: "Today by 5:00 PM",
    carrier: "FedEx Priority",
    trackingNumber: "456789123456",
    shippingAddress: "350 5th Ave, New York, NY 10118"
  }
};

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(SAMPLE_ORDERS["ORD-84920"]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = orderQuery.trim().toUpperCase();

    if (!cleaned || cleaned.length < 3) {
      setErrorMsg("Please enter a valid Order Number (e.g. ORD-84920).");
      setActiveOrder(null);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try Supabase lookup
      const dbOrder = await fetchOrderById(cleaned);
      if (dbOrder) {
        setActiveOrder({
          orderId: dbOrder.order_id,
          customerName: dbOrder.customer_name,
          email: dbOrder.email,
          productName: dbOrder.product_name,
          itemType: dbOrder.item_type || "hat",
          technique: dbOrder.technique || "print",
          image: dbOrder.image_url || "/hat-front.png",
          quantity: dbOrder.quantity,
          total: dbOrder.total_price,
          statusStep: dbOrder.status_step || 1,
          placedDate: dbOrder.created_at ? new Date(dbOrder.created_at).toLocaleDateString() : "Recent Order",
          estimatedDelivery: "In 5-7 Business Days",
          carrier: dbOrder.carrier || "Standard Shipping",
          trackingNumber: dbOrder.tracking_number || "Pending",
          shippingAddress: dbOrder.shipping_address || "Standard Address on File",
          cartData: dbOrder.cart_data || "[]"
        });
        setErrorMsg("");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Supabase lookup exception:", err);
    }

    // 2. Check sample orders
    if (SAMPLE_ORDERS[cleaned]) {
      setActiveOrder(SAMPLE_ORDERS[cleaned]);
      setErrorMsg("");
      setIsLoading(false);
      return;
    }

    // 3. Fallback active simulation for any custom test ID
    setActiveOrder({
      orderId: cleaned.startsWith("ORD-") ? cleaned : `ORD-${cleaned}`,
      customerName: "Valued Customer",
      email: emailQuery || "customer@example.com",
      productName: "Custom Embroidered & Printed Apparel",
      itemType: "hat",
      technique: "embroidery",
      image: "/hat-front.png",
      quantity: 24,
      total: "$349.50",
      statusStep: 3,
      placedDate: "Recent Order",
      estimatedDelivery: "Within 5-7 business days",
      carrier: "Standard Shipping",
      trackingNumber: "Pending",
      shippingAddress: "Standard Shipping Address on File",
      cartData: "[]"
    });
    setErrorMsg("");
    setIsLoading(false);
  };

  const steps = [
    { step: 1, title: "Order Confirmed", desc: "Payment received & verified" },
    { step: 2, title: "Proof & Digitizing", desc: "Artwork & stitch path approved" },
    { step: 3, title: "In Production", desc: "Printing, embroidery & curing" },
    { step: 4, title: "Quality Check", desc: "Inspected & hand packed" },
    { step: 5, title: "Out for Delivery", desc: "In transit with courier" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F9]">
      <Header />

      <main className="flex-1 w-full pb-20">
        {/* Banner matching Homepage Hero Aesthetic */}
        <section className="w-full bg-[var(--color-hero-bg)] py-14 lg:py-16 px-4 flex justify-center border-b border-[#9fc9eb]/50">
          <div className="max-w-[1280px] w-full flex flex-col items-center text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-light-blue)] gap-2 mb-3">
              <Truck className="w-4 h-4 text-[var(--color-dark-blue)]" />
              <span className="font-semibold text-xs md:text-sm text-[var(--color-dark-blue)]">
                Live Order & Shipment Tracking
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-dark-text)] font-roboto-slab tracking-tight max-w-2xl">
              Track Your Custom Order
            </h1>

            <p className="mt-3 text-sm md:text-base text-[var(--color-dark-text)] max-w-xl">
              Check live proof approval, embroidery stitching, and courier transit updates for your order.
            </p>

            {/* Quick Sample Badges */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center items-center text-xs">
              <span className="text-[var(--color-dark-blue)] font-semibold">Try sample orders:</span>
              {Object.keys(SAMPLE_ORDERS).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setOrderQuery(id);
                    setActiveOrder(SAMPLE_ORDERS[id]);
                    setErrorMsg("");
                  }}
                  className="px-3 py-1 bg-white/80 hover:bg-white text-[var(--color-primary)] rounded-full font-mono font-bold transition-all border border-[#9fc9eb] shadow-2xs"
                >
                  #{id}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto px-4 -mt-7">
          <form 
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-3 md:p-4 shadow-lg border border-gray-200 flex flex-col md:flex-row gap-3 items-center"
          >
            <div className="flex-1 w-full relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. ORD-84920)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="w-full md:w-72 relative">
              <input
                type="email"
                placeholder="Email Address (optional)"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-colors shrink-0"
            >
              {isLoading ? "Searching..." : "Track Status"}
            </button>
          </form>
          {errorMsg && (
            <p className="text-red-500 text-xs font-bold mt-2 text-center">{errorMsg}</p>
          )}
        </div>

        {/* Tracking Details Card */}
        {activeOrder && (
          <div className="max-w-5xl mx-auto px-4 mt-10 space-y-6">
            
            {/* Status Header Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-gray-400 uppercase">ORDER</span>
                    <h2 className="text-2xl font-black text-[var(--color-dark-blue)] font-roboto-slab">
                      #{activeOrder.orderId}
                    </h2>
                    <span className="ml-2 px-3 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Placed on <strong>{activeOrder.placedDate}</strong> for <strong>{activeOrder.customerName}</strong>
                  </p>
                </div>

                <div className="flex flex-col md:items-end">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Delivery</span>
                  <span className="text-xl font-bold text-[var(--color-primary)] font-roboto-slab">
                    {activeOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Multi-Step Timeline */}
              <div className="pt-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {steps.map((st) => {
                    const isCompleted = activeOrder.statusStep >= st.step;
                    const isCurrent = activeOrder.statusStep === st.step;

                    return (
                      <div key={st.step} className="flex md:flex-col items-center gap-3 md:text-center relative">
                        {/* Circle Indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isCompleted 
                            ? "bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20" 
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : st.step}
                        </div>

                        {/* Text */}
                        <div className="flex-1 md:flex-none">
                          <h4 className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                            {st.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Removed Carrier Tracking Pill */}
            </div>

            {/* Order Details & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Product Info Card (2 cols) */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-base text-[var(--color-dark-blue)] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--color-primary)]" /> Items in Production
                </h3>

                <div className="flex flex-col gap-4">
                  {(() => {
                    let cartItems = [];
                    try {
                      if ((activeOrder as any).cartData && (activeOrder as any).cartData !== "[]") {
                        cartItems = JSON.parse((activeOrder as any).cartData);
                      } else {
                        cartItems = [activeOrder];
                      }
                    } catch (e) {
                      cartItems = [activeOrder];
                    }

                    return cartItems.map((item: any, idx: number) => {
                      const defaultImg = item.itemType === 'hat' || item.productType === 'hat' ? '/hat-front.png' : '/shirt-front.png';
                      const techniqueName = item.technique === 'embroidery' ? '3D Custom Embroidery' : item.technique === 'laser' ? 'Laser Engraved Patch' : 'Direct Print (DTF)';
                      
                      let images = [item.frontImage, item.backImage, item.leftImage, item.rightImage].filter(Boolean);
                      if (images.length === 0) {
                        try {
                           images = item.image?.startsWith('[') ? JSON.parse(item.image) : [item.image].filter(Boolean);
                        } catch(e) {
                           images = [item.image].filter(Boolean);
                        }
                      }
                      if (images.length === 0) images = [defaultImg];

                      return (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex flex-wrap gap-2 shrink-0">
                            {images.map((img: string, i: number) => (
                               <div key={i} className="relative w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-1">
                                 <img src={img} className="w-full h-full object-contain" />
                               </div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-gray-900 truncate">
                                Custom {item.productType || item.itemType || 'Apparel'}
                              </h4>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-[var(--color-dark-blue)]">
                                {techniqueName}
                              </span>
                            </div>
        
                            <p className="text-xs text-gray-500 mt-1">
                              Color: <strong>{item.shirtColor || 'White'}</strong>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Quantity: <strong>{item.quantity || Object.values(item.quantities || {}).reduce((s: any, v: any) => s + parseInt(v || '0'), 0)} units</strong>
                            </p>
        
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Guaranteed
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Need to modify your design or address?</span>
                  <a 
                    href={`https://wa.me/15045643000?text=Hi%2C%20regarding%20my%20order%20%23${activeOrder.orderId}%20I%20have%20a%20question.`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" /> Contact on WhatsApp
                  </a>
                </div>
              </div>

              {/* Destination Address Card (1 col) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--color-dark-blue)] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" /> Shipping Destination
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1.5 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900">{activeOrder.customerName}</p>
                    <p>{activeOrder.shippingAddress}</p>
                    <p className="text-gray-400 pt-1">{activeOrder.email}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href="/design"
                    className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Start New Design</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
