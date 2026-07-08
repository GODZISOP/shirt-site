export default function BrandLogos() {
  return (
    <section className="w-full bg-[#F5F5ED] py-16 flex justify-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-80 mix-blend-multiply">
        
        <div className="flex items-center gap-1 text-xl font-bold tracking-widest text-black">
          BELLA<span className="text-[10px] pb-2">+</span>CANVAS.
        </div>
        
        <div className="flex items-center bg-black text-white px-3 py-1 font-bold transform -rotate-3 text-lg rounded-sm">
          Hanes
        </div>
        
        <div className="flex items-center font-bold tracking-tighter text-xl">
          American Apparel
        </div>
        
        <div className="flex items-center font-black tracking-tighter text-2xl italic">
          <span className="text-red-600 mr-[2px]">C</span>hampion
        </div>
        
        <div className="flex items-center font-black tracking-widest text-2xl uppercase">
          Gildan
        </div>

      </div>
    </section>
  );
}
