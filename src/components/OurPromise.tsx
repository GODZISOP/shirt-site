import { ShieldCheck, Shirt, MessageSquareHeart } from "lucide-react";

export default function OurPromise() {
  return (
    <section className="w-full bg-white py-16 lg:py-24 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-16">
        
        <div className="flex flex-col items-center gap-4">
          <div className="px-4 py-1.5 bg-blue-50 text-[var(--color-primary)] rounded-full text-[10px] font-bold tracking-widest uppercase">
            Our Promise
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[600px] leading-tight tracking-tight">
            ooShirts makes it fun and affordable to order custom t-shirts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 w-full text-center">
          {/* Low Price Guarantee */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-dark-blue)] tracking-tight">Low Price Guarantee</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              ooShirts.com was founded by a high school student in 2007 with an investment of just $2000. Our goal was to offer <a href="#" className="underline hover:text-[var(--color-primary)]">custom apparel</a> that's actually affordable to school groups, nonprofits, families, and small businesses in the US. If you find a lower price online, simply send it to us and we'll match the price.
            </p>
          </div>

          {/* Amazing Print Quality */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Shirt className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-dark-blue)] tracking-tight">Amazing Print Quality</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              High quality printing comes from years of printing experience, use of top-notch inks, and an unwavering commitment to producing well-made <a href="#" className="underline hover:text-[var(--color-primary)]">t-shirt designs</a>. We guarantee our prints will last wash after wash, and that our garments will come free of material defects - or we'll redo your order from scratch.
            </p>
          </div>

          {/* Rave-worthy Service */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <MessageSquareHeart className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-dark-blue)] tracking-tight">Rave-worthy Service</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Our support staff is available 7 days a week over the phone, email, and live chat. We welcome questions of all kind - from questions about how to design your own t-shirt to explanations about the types of custom shirts you can order to any fun or off-topic question of your choice. Either way, we're here to help.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
