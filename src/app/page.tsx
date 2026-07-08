import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShippingStats from "@/components/ShippingStats";
import ProductCategories from "@/components/ProductCategories";
import BrandLogos from "@/components/BrandLogos";
import CustomerPhotos from "@/components/CustomerPhotos";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9f9]">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Hero />
        <ShippingStats />
        <ProductCategories />
        <BrandLogos />
        <CustomerPhotos />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
