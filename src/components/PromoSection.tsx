import Image from "next/image";
import boyImg from "../app/Shirt/image copy 16.png";

import promoImg1 from "../app/Shirt/women.png"; // Tall image
import promoImg2 from "../app/Shirt/landing-embroidered-patches.jpg"; // Small image
import promoImg3 from "../app/Shirt/images.jpg"; // Small photo

export default function PromoSection() {
  return (
    <section className="w-full bg-[#FDF6EC] flex flex-col items-center pb-16 lg:pb-24">
      
      {/* Top Banner with Custom CSS Background and User's Image */}
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[900px] bg-[#eef5fa] overflow-hidden flex justify-center">
        
        {/* Dynamic Background Elements */}
        {/* Subtle Dot Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(#1e3a5f 2px, transparent 2px)', backgroundSize: '32px 32px' }}
        ></div>
        
        {/* Glowing Ambient Blobs for Depth (Blue Theme) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40"></div>
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>
        
        {/* Brand Logo overlay (Top Left) */}
        <div className="absolute top-8 left-6 md:top-12 md:left-12 flex items-center gap-3 z-30 drop-shadow-sm">
           <div className="text-4xl font-[cursive] text-[#1e3a5f] italic font-black">R</div>
           <span className="text-xl md:text-2xl font-bold text-[#1e3a5f] tracking-widest uppercase">Demir Studio</span>
        </div>

        {/* The User's Uploaded Image with the Boy and Ribbons */}
        <div className="absolute bottom-0 w-full max-w-[800px] h-[95%] mx-auto z-20 flex justify-center">
          <Image 
            src={boyImg} 
            alt="Model with Custom Patches" 
            fill 
            className="object-contain object-bottom drop-shadow-2xl"
            priority
            quality={100}
            unoptimized
          />
        </div>

        {/* Wavy shape divider connecting to the cream background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-[1px] z-30">
          <svg viewBox="0 0 1440 120" className="relative block w-full h-[40px] md:h-[80px] lg:h-[120px] text-[#FDF6EC] fill-current" preserveAspectRatio="none">
            <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-12 lg:gap-16 px-4 lg:px-[30px] mt-8 lg:mt-12 overflow-hidden">
        
        {/* Heading Block */}
        <div className="relative w-full max-w-4xl mx-auto text-center mt-4">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#1e3a5f] leading-[1.1] tracking-tight">
            Discover the stunning details of our custom patches made with <span className="font-[cursive] text-[#3b82f6] font-normal italic px-2">passion</span> and pure craftsmanship
          </h2>
          <div className="absolute top-0 right-4 md:-right-4 -mt-8 md:-mt-10 bg-[#1e3a5f] text-white text-xs md:text-sm font-bold uppercase tracking-widest py-3 px-6 rounded-full rotate-[15deg] border-4 border-[#FDF6EC] shadow-sm">
            100% Cotton
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-[280px] lg:auto-rows-[320px]">
          
          {/* Column 1, Top: Large Navy Blue Card */}
          <div className="bg-[#1e3a5f] rounded-[32px] p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">100% Custom</h3>
            <p className="text-blue-100 text-sm md:text-base font-semibold leading-relaxed uppercase tracking-wider">
              Crafted with pure natural materials and vibrant threads to bring your unique vision to life.
            </p>
          </div>

          {/* Column 2, Top: Small Image Card */}
          <div className="relative rounded-[32px] overflow-hidden bg-white">
            <Image 
              src={promoImg2} 
              alt="Custom patches" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Column 3 (lg) / Column 2 (md): Tall Image Card spanning two rows */}
          <div className="relative rounded-[32px] overflow-hidden bg-white md:row-span-2">
            <Image 
              src={promoImg1} 
              alt="Premium Quality" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Column 1, Bottom-Left: Small Photo Card */}
          <div className="relative rounded-[32px] overflow-hidden bg-white">
            <Image 
              src={promoImg3} 
              alt="Quality threads" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Column 2, Bottom-Right: Bright Blue Card */}
          <div className="bg-[#3b82f6] rounded-[32px] p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">Made to Last</h3>
            <p className="text-blue-100 text-sm md:text-base font-semibold leading-relaxed uppercase tracking-wider">
              Our patches are iron-on and sew-on ready, designed for ultimate durability and style.
            </p>
          </div>

        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <div className="w-3 h-3 rounded-full bg-[#1e3a5f]"></div>
          <div className="w-3 h-3 rounded-full bg-blue-200"></div>
          <div className="w-3 h-3 rounded-full bg-blue-200"></div>
        </div>
        
      </div>
    </section>
  );
}
