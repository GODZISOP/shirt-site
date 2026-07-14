"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  "/Shirt/image copy 7.png",
  "/Shirt/image copy 8.png",
  "/Shirt/image copy 10.png",
  "/Shirt/image copy 9.png",
  "/Shirt/human_patch_1.png",
  "/Shirt/human_patch_2.png"
];

const transforms = [
  { x: "-125%", xPop: "-140%", y: "15%", yPop: "5%", rotate: -15, rotatePop: -25, zIndex: 10 },
  { x: "-75%", xPop: "-85%", y: "5%", yPop: "-5%", rotate: -8, rotatePop: -15, zIndex: 20 },
  { x: "-25%", xPop: "-25%", y: "0%", yPop: "0%", rotate: -2, rotatePop: -2, zIndex: 50 }, // Left Center
  { x: "25%", xPop: "25%", y: "0%", yPop: "0%", rotate: 2, rotatePop: 2, zIndex: 40 }, // Right Center
  { x: "75%", xPop: "85%", y: "5%", yPop: "-5%", rotate: 8, rotatePop: 15, zIndex: 30 },
  { x: "125%", xPop: "140%", y: "15%", yPop: "5%", rotate: 15, rotatePop: 25, zIndex: 20 },
];

export default function CustomerPhotos() {
  return (
    <section className="w-full bg-white py-20 lg:py-32 flex flex-col items-center overflow-hidden">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-16 lg:gap-24">
        
        <div className="flex flex-col items-center gap-3">
          <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
            Customers
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[800px] leading-tight tracking-tight">
            A place to display your masterpiece.
          </h2>
        </div>

        <div className="relative w-full flex justify-center items-center h-[350px] sm:h-[450px] md:h-[550px] mt-8">
          {photos.map((photo, i) => (
            <motion.div 
              key={i} 
              initial={{ x: "0%", y: "30%", rotate: 0, opacity: 0, scale: 0.7 }}
              whileInView={{ 
                x: ["0%", "0%", transforms[i].xPop, transforms[i].x], 
                y: ["30%", "0%", transforms[i].yPop, transforms[i].y], 
                rotate: [0, 0, transforms[i].rotatePop, transforms[i].rotate], 
                opacity: [0, 1, 1, 1], 
                scale: [0.7, 1, 1.05, 1] 
              }}
              transition={{ 
                duration: 1.8, 
                times: [0, 0.25, 0.65, 1],
                ease: "easeInOut"
              }}
              viewport={{ once: false, margin: "-100px" }}
              style={{ zIndex: transforms[i].zIndex }}
              className="absolute w-[180px] sm:w-[260px] md:w-[320px] aspect-[4/5] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white"
            >
              <Image 
                src={photo}
                alt={`Customer Photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
