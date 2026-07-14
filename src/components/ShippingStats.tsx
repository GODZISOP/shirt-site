import { CheckCircle2, Calendar, Truck } from "lucide-react";

export default function ShippingStats() {
  return (
    <section className="w-full bg-[var(--color-stats-bg)] flex justify-center py-12 lg:py-12 border-b border-gray-200 overflow-hidden">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px]">
        
        {/* On mobile: grid-cols-1 with items-center and text-center. On desktop: grid-cols-3 with left alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-6 w-full lg:max-w-none">
          
          {/* Stat 1 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 md:gap-5 justify-center lg:justify-start w-full text-center lg:text-left">
            <div className="w-[60px] h-[60px] md:w-[86px] md:h-[86px] rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-center lg:items-start">
              <p className="text-xl md:text-2xl text-[var(--color-dark-text)] font-bold leading-[20px]">
                Over 10 million
              </p>
              <p className="text-xs md:text-sm text-gray-500 leading-[18px]">
                shirts printed since 2007
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 md:gap-5 justify-center lg:justify-start w-full text-center lg:text-left">
            <div className="w-[60px] h-[60px] md:w-[86px] md:h-[86px] rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 md:w-10 md:h-10 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2 items-center lg:items-start">
              <p className="text-base md:text-lg leading-[13px] tracking-tight font-bold text-[var(--color-primary)]">
                Free Shipping
              </p>
              <div className="flex flex-col gap-[2px] md:gap-[6px] items-center lg:items-start">
                <p className="text-xs md:text-sm text-gray-500 leading-[18px]">
                  Guaranteed delivery by
                </p>
                <p className="text-xl md:text-2xl text-[var(--color-dark-text)] font-bold leading-[20px]">
                  July 23
                </p>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 md:gap-5 justify-center lg:justify-start w-full text-center lg:text-left">
            <div className="w-[60px] h-[60px] md:w-[86px] md:h-[86px] rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 md:w-10 md:h-10 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2 items-center lg:items-start">
              <p className="text-base md:text-lg leading-[13px] tracking-tight font-bold text-[var(--color-primary)]">
                Rush Shipping
              </p>
              <div className="flex flex-col gap-[2px] md:gap-[6px] items-center lg:items-start">
                <p className="text-xs md:text-sm text-gray-500 leading-[18px]">
                  Available at checkout
                </p>
                <p className="text-lg md:text-xl text-[var(--color-dark-text)] font-bold leading-[20px]">
                  Fast & Reliable
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
