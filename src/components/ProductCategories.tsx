import Link from "next/link";
import { Shirt, HandHeart } from "lucide-react";

const categories = [
  { name: "Custom Shirts", items: 3, top: true },
  { name: "Custom Hoodies", items: 3, top: true },
  { name: "Custom Sweatshirts", items: 3, top: true },
  { name: "Youth Tees", items: 5, top: false },
  { name: "Performance Styles", items: 5, top: false },
  { name: "Long Sleeve Shirts", items: 5, top: false },
  { name: "Women Shirts", items: 5, top: false },
  { name: "Jackets", items: 5, top: false },
];

export default function ProductCategories() {
  return (
    <section className="w-full bg-white py-16 lg:py-24 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-12">
        
        <h2 className="text-3xl md:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center tracking-tight max-w-[600px]">
          Choose from a variety of t-shirt styles
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center group cursor-pointer ${cat.top ? 'col-span-2 md:col-span-1 lg:col-span-2 lg:first:col-span-1 lg:[&:nth-child(2)]:col-span-2 lg:[&:nth-child(3)]:col-span-2' : ''}`}
            >
              <div className="w-full aspect-square bg-[#F8F9F9] rounded-2xl flex flex-col items-center justify-center p-6 mb-4 transition-transform group-hover:-translate-y-1 group-hover:shadow-lg relative overflow-hidden">
                <p className="absolute top-4 text-[var(--color-dark-blue)] font-bold text-sm z-10">{cat.name}</p>
                <Shirt className={`w-24 h-24 text-gray-300 transition-colors group-hover:text-[var(--color-primary)] ${cat.top ? 'w-32 h-32' : ''}`} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
          <p className="text-sm text-gray-500 text-center max-w-[300px]">
            Join 1,000,000+ customers who have used ooShirts to create custom printed t-shirts.
          </p>
          <Link
            href="#"
            className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-md"
          >
            Start Designing
          </Link>
        </div>

      </div>
    </section>
  );
}
