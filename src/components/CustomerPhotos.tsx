import { Users } from "lucide-react";

export default function CustomerPhotos() {
  return (
    <section className="w-full bg-white py-16 lg:py-24 flex flex-col items-center">
      <div className="max-w-[1080px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-12">
        
        <div className="flex flex-col items-center gap-2">
          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Customers
          </div>
          <h2 className="text-3xl md:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[500px] leading-tight">
            Join 1,000,000+ happy customers today
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative group">
              <div className="absolute inset-0 bg-[var(--color-dark-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              {/* Using a placeholder for customer images */}
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <Users className="w-16 h-16 mb-2 opacity-50" />
                <p className="font-medium text-sm">Customer Team Photo {i}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
