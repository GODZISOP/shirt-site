"use client";

import { ShieldCheck, Shirt, MessageSquareHeart, Zap, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const promises = [
  {
    id: "01",
    title: "Low Price Guarantee",
    desc: "Demir Studio was founded by a high school student in 2007 with an investment of just $2000. Our goal was to offer custom apparel that's actually affordable to school groups, nonprofits, families, and small businesses in the US.",
    icon: ShieldCheck,
    colorClasses: { pin: "bg-blue-500", text: "text-blue-500", iconBg: "bg-blue-500" },
    shadowColor: "rgba(59, 130, 246, 0.25)"
  },
  {
    id: "02",
    title: "Amazing Print Quality",
    desc: "High quality printing comes from years of printing experience, use of top-notch inks, and an unwavering commitment to producing well-made t-shirt designs. We guarantee our prints will last wash after wash.",
    icon: Shirt,
    colorClasses: { pin: "bg-rose-500", text: "text-rose-500", iconBg: "bg-rose-500" },
    shadowColor: "rgba(244, 63, 94, 0.25)"
  },
  {
    id: "03",
    title: "Rave-worthy Service",
    desc: "Our support staff is available 7 days a week over the phone, email, and live chat. We welcome questions of all kind - from how to design your own t-shirt to any fun or off-topic question of your choice.",
    icon: MessageSquareHeart,
    colorClasses: { pin: "bg-emerald-500", text: "text-emerald-500", iconBg: "bg-emerald-500" },
    shadowColor: "rgba(16, 185, 129, 0.25)"
  },
  {
    id: "04",
    title: "Lightning Fast Delivery",
    desc: "We know you need your custom gear fast. Our streamlined production process ensures your order is printed and shipped in record time, without compromising on quality or attention to detail.",
    icon: Zap,
    colorClasses: { pin: "bg-purple-500", text: "text-purple-500", iconBg: "bg-purple-500" },
    shadowColor: "rgba(168, 85, 247, 0.25)"
  },
  {
    id: "05",
    title: "Eco-Friendly Options",
    desc: "We care about the planet. That's why we offer a wide range of sustainable, eco-friendly apparel and use water-based, non-toxic inks for a greener footprint. Good for you, good for the earth.",
    icon: Leaf,
    colorClasses: { pin: "bg-teal-500", text: "text-teal-500", iconBg: "bg-teal-500" },
    shadowColor: "rgba(20, 184, 166, 0.25)"
  }
];

export default function OurPromise() {
  return (
    <section className="relative w-full bg-[#fdfdfd] py-20 lg:py-32 flex flex-col items-center overflow-hidden">
      {/* Graph Paper Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]" 
        style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="relative z-10 max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-16 lg:gap-24">
        
        <div className="flex flex-col items-center gap-4 bg-white/70 p-6 rounded-3xl backdrop-blur-sm max-w-[700px] text-center border border-white shadow-sm">
          <div className="px-4 py-1.5 bg-blue-50 text-[var(--color-primary)] rounded-full text-xs font-bold tracking-widest uppercase">
            Our Promise
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-dark-blue)] font-bold font-roboto-slab leading-tight tracking-tight">
            Demir Studio makes it fun and affordable to order custom t-shirts
          </h2>
        </div>

        <div className="relative w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-16 mt-8 lg:mt-16 pb-16">
          {/* SVG Dotted Lines for Desktop connecting the boxes */}
          <svg className="absolute hidden lg:block top-[15%] left-[15%] w-[70%] h-[100px] z-0 opacity-50 pointer-events-none" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d="M 0,0 C 250,0 250,200 500,200 C 750,200 750,0 1000,0" stroke="#94a3b8" strokeWidth="3" strokeDasharray="12,12" fill="none" />
          </svg>
          <svg className="absolute hidden lg:block top-[65%] left-[15%] w-[70%] h-[100px] z-0 opacity-50 pointer-events-none" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d="M 0,0 C 250,0 250,200 500,200 C 750,200 750,0 1000,0" stroke="#94a3b8" strokeWidth="3" strokeDasharray="12,12" fill="none" />
          </svg>

          {promises.map((item, idx) => {
            // Force item 05 (index 4) to sit in column 3 directly under item 03
            const colStartClass = idx === 4 ? "lg:col-start-3" : "";
            // Push only item 02 (index 1) down to create the zigzag stagger
            const translateYClass = idx === 1 ? "lg:translate-y-16" : "";

            return (
             <motion.div 
               key={item.id} 
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.7, delay: idx * 0.2, type: "spring", bounce: 0.4 }}
               viewport={{ once: false, margin: "50px" }}
               className={`relative z-10 w-full flex ${colStartClass} ${translateYClass}`}
             >
                <div className="relative w-full bg-white/95 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 flex flex-col items-start gap-6 transition-transform duration-300 hover:-translate-y-2" style={{ boxShadow: `0 25px 50px -12px ${item.shadowColor}` }}>
                  
                  {/* Push Pin */}
                  <div className="absolute -top-4 left-10 group cursor-default">
                    <div className={`w-7 h-7 rounded-full ${item.colorClasses.pin} shadow-[inset_0_-3px_6px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] relative z-20`}>
                      <div className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-white/50 blur-[0.5px]"></div>
                    </div>
                    {/* Pin shadow */}
                    <div className="w-6 h-2 bg-black/15 rounded-full absolute -bottom-5 -right-3 rotate-[35deg] blur-[2px] z-10"></div>
                  </div>

                  {/* Header: ID + Icon */}
                  <div className="flex items-center justify-between w-full border-b border-gray-100 pb-5">
                    <span className={`text-5xl font-black opacity-80 ${item.colorClasses.text}`}>{item.id}</span>
                    <div className={`w-14 h-14 rounded-2xl ${item.colorClasses.iconBg} text-white flex items-center justify-center shadow-lg -rotate-3 transition-transform duration-300 hover:rotate-6`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-dark-blue)] tracking-tight">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
             </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
