import Link from "next/link";
import { MessageCircle, Phone, CheckCircle2 } from "lucide-react";

export default function SupportSection() {
  return (
    <section className="w-full bg-[#F5F5ED] py-16 lg:py-24 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-12">
        
        <div className="flex flex-col items-center gap-4">
          <div className="px-4 py-1.5 bg-blue-100 text-[var(--color-primary)] rounded-full text-[10px] font-bold tracking-widest uppercase">
            We're Here to Help
          </div>
          <h2 className="text-3xl md:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[600px] leading-tight tracking-tight">
            Incredible service. All-inclusive pricing. Real reviews.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Chat with a real expert */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="w-full h-48 bg-gray-200 relative">
              {/* Placeholder for the support agent image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <span className="text-sm">Support Agent Image</span>
              </div>
            </div>
            <div className="p-8 flex flex-col gap-6 text-center h-full">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[var(--color-dark-blue)] text-xl tracking-tight">Chat with a real expert</h3>
                <p className="text-sm text-gray-500">Live chat with a Shirt Specialist or speak one-on-one with our pros.</p>
              </div>
              
              <div className="flex flex-col gap-4 mt-auto">
                <Link href="tel:8882571918" className="flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Talk to real person</span>
                    <span className="font-bold text-[var(--color-primary)] group-hover:underline">888-257-1918</span>
                  </div>
                </Link>
                
                <Link href="#" className="flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Chat with a real person</span>
                    <span className="font-bold text-[var(--color-primary)] group-hover:underline">Chat now</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Your price includes */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
             <div className="w-full h-48 bg-gray-200 relative">
              {/* Placeholder for the printing facility image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <span className="text-sm">Facility Image</span>
              </div>
            </div>
            <div className="p-8 flex flex-col gap-6 text-center h-full">
              <h3 className="font-bold text-[var(--color-dark-blue)] text-xl tracking-tight">Your price includes</h3>
              
              <ul className="flex flex-col gap-4 mt-2 text-left">
                {[
                  "Free Shipping & Setup",
                  "Guaranteed Fast Delivery",
                  "Expert Design Review",
                  "Friendly Support, Open 7 Days",
                  "No Minimum Orders",
                  "Guaranteed Low Prices"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col p-8">
            <h3 className="font-bold text-[var(--color-dark-blue)] text-xl tracking-tight text-center mb-6">Customer Reviews</h3>
            
            <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="bg-[#F8F9ED] p-5 rounded-lg flex flex-col gap-3">
                <p className="text-sm text-[var(--color-dark-text)] leading-relaxed italic">
                  "Outstanding service! The staff was attentive and helpful, making my experience exceptional."
                </p>
                <p className="text-xs font-bold text-[var(--color-dark-blue)]">Amanda</p>
              </div>

              <div className="bg-[#F8F9ED] p-5 rounded-lg flex flex-col gap-3">
                <p className="text-sm text-[var(--color-dark-text)] leading-relaxed italic">
                  "The customer support was fantastic! They quickly resolved my issue and were very friendly."
                </p>
                <p className="text-xs font-bold text-[var(--color-dark-blue)]">Michael</p>
              </div>

              <div className="bg-[#F8F9ED] p-5 rounded-lg flex flex-col gap-3">
                <p className="text-sm text-[var(--color-dark-text)] leading-relaxed italic">
                  "I was impressed by their commitment to going the extra mile."
                </p>
                <p className="text-xs font-bold text-[var(--color-dark-blue)]">Chris</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
