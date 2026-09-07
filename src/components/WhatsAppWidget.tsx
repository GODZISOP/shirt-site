"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Shirt, Truck, Flame } from "lucide-react";
import BaseballCapIcon from "@/components/icons/BaseballCapIcon";
import { triggerKeepAlive } from "@/lib/supabase";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const phoneNumber = "15045643000"; // Customer support hotline/WhatsApp number

  useEffect(() => {
    // Ultra-lightweight keep-alive to keep Supabase awake (runs max once/24h)
    triggerKeepAlive();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || "Hello! I would like to get a quote for custom apparel (T-Shirts / Hats).";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  const quickMessages = [
    { text: "Quote for custom embroidered hats", icon: "hat" },
    { text: "Bulk pricing for custom printed shirts", icon: "shirt" },
    { text: "Laser engraved leather patch inquiry", icon: "laser" },
    { text: "Check rush turnaround & shipping time", icon: "truck" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Popup Chat Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-[#25D366] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Direct Print & Embroidery Support</h4>
                <p className="text-[11px] text-white/90">Typically replies in under 5 minutes</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#f0f2f5] max-h-72 overflow-y-auto space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-gray-100 text-gray-800 space-y-1">
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" /> Hello there!
              </p>
              <p className="text-gray-600">
                Looking for an instant quote on <strong>Custom T-Shirts, Embroidered Hats, or Laser Patches</strong>?
              </p>
              <p className="text-gray-600">
                Send us a message or pick a quick question below:
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Quick Inquiries:</span>
              {quickMessages.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(item.text)}`;
                    window.open(url, "_blank");
                    setIsOpen(false);
                  }}
                  className="w-full text-left bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 p-2 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all font-medium flex items-center justify-between group"
                >
                  <span className="truncate flex items-center gap-2">
                    {item.icon === "hat" && <BaseballCapIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    {item.icon === "shirt" && <Shirt className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    {item.icon === "laser" && <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    {item.icon === "truck" && <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    <span>{item.text}</span>
                  </span>
                  <Send className="w-3 h-3 text-gray-300 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message or design query..."
              className="flex-1 text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#25D366] text-gray-800"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
              aria-label="Send WhatsApp message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Main Floating WhatsApp Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full"></span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wide leading-tight">Order via WhatsApp</span>
          <span className="text-[10px] text-emerald-100 font-medium leading-tight">Instant Quote & Support</span>
        </div>
      </button>
    </div>
  );
}
