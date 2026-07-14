"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 lg:py-24 flex flex-col items-center overflow-hidden" style={{ perspective: "1500px" }}>
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-8 lg:gap-16">

        <h2 className="text-2xl md:text-3xl lg:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[500px] leading-tight">
          What our customers have to say
        </h2>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }} // Triggers when 20% of the grid is visible
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full"
        >
          {reviews.map((review, idx) => {
            let initialProps: any, whileInViewProps: any;
            let customDelay = 0;

            if (idx === 0) {
              // Top Left: from top-left corner
              initialProps = { opacity: 0, x: -200, y: -200, rotate: -30, scale: 0.8 };
              whileInViewProps = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
              customDelay = 0;
            } else if (idx === 2) {
              // Top Right: from top-right corner
              initialProps = { opacity: 0, x: 200, y: -200, rotate: 30, scale: 0.8 };
              whileInViewProps = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
              customDelay = 0;
            } else if (idx === 1) {
              // Top Center: appears after top left and right
              initialProps = { opacity: 0, scale: 0.5, y: -50 };
              whileInViewProps = { opacity: 1, scale: 1, y: 0 };
              customDelay = 0.4;
            } else if (idx === 3) {
              // Bottom Left: from bottom-left corner
              initialProps = { opacity: 0, x: -200, y: 200, rotate: 30, scale: 0.8 };
              whileInViewProps = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
              customDelay = 0.8;
            } else if (idx === 5) {
              // Bottom Right: from bottom-right corner
              initialProps = { opacity: 0, x: 200, y: 200, rotate: -30, scale: 0.8 };
              whileInViewProps = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
              customDelay = 0.8;
            } else if (idx === 4) {
              // Bottom Center: appears after bottom left and right
              initialProps = { opacity: 0, scale: 0.5, y: 50 };
              whileInViewProps = { opacity: 1, scale: 1, y: 0 };
              customDelay = 1.2;
            }

            return (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: initialProps,
                  visible: {
                    ...whileInViewProps,
                    transition: {
                      duration: 1.2, 
                      ease: [0.16, 1, 0.3, 1], // Springy feeling
                      delay: customDelay
                    }
                  }
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-4 md:gap-6 h-full cursor-pointer hover:shadow-2xl hover:shadow-blue-900/10 transition-shadow duration-300"
              >
                <div className="flex flex-col">
                  <p className="font-bold text-[var(--color-dark-text)] text-base md:text-lg">{review.name}</p>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">{review.role}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[var(--color-dark-text)] text-sm md:text-base leading-relaxed font-medium">
                  "{review.text}"
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
