import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sara Doe",
    role: "Product Mgr",
    rating: 5,
    text: "I love these shirts! The shirt quality is fantastic, the color is great, and the logo looks perfect! I could not be happier with your company!"
  },
  {
    name: "Tiffany May",
    role: "Marketing",
    rating: 5,
    text: "Shirts were delivered ahead of schedule. Friendly, knowledgeable customer service and very helpful art designers."
  },
  {
    name: "Tom S",
    role: "Business Owner",
    rating: 5,
    text: "Just found on a search with Google by chance, website worked perfect, if you were a stock I would rate you AAA."
  },
  {
    name: "Eliza Henry",
    role: "Camp Counselor",
    rating: 5,
    text: "The printing looked great, was well priced, and arrived on time."
  },
  {
    name: "Julie Morris",
    role: "Senior Buyer",
    rating: 5,
    text: "I have researched MANY places to buy screenprinted shirts and you have the best prices and great quality. You also have the best customer service!"
  },
  {
    name: "LaNora James",
    role: "Event Coordinator",
    rating: 5,
    text: "Love the shirts! Can't wait until my students see them!"
  }
];

export default function Testimonials() {
  return (
    <section className="w-full bg-white pb-20 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-12">
        
        <h2 className="text-3xl md:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[500px] leading-tight">
          What our customers have to say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-[#F8F9ED] p-6 flex flex-col gap-4 h-full">
              <div className="flex flex-col">
                <p className="font-bold text-[var(--color-dark-text)] text-sm">{review.name}</p>
                <p className="text-xs text-gray-500">{review.role}</p>
              </div>
              <div className="flex gap-[2px]">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[var(--color-dark-text)] text-sm leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
