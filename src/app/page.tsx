import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoSection from "@/components/PromoSection";
import ShippingStats from "@/components/ShippingStats";
import ProductCategories from "@/components/ProductCategories";
import BrandLogos from "@/components/BrandLogos";
import CustomerPhotos from "@/components/CustomerPhotos";
import Testimonials from "@/components/Testimonials";
import OurPromise from "@/components/OurPromise";
import FAQ from "@/components/FAQ";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9f9]">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Hero />
        <ShippingStats />
        <ProductCategories />

        <PromoSection />
        <BrandLogos />
        <CustomerPhotos />
        <Testimonials />
        <OurPromise />
        <FAQ />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}
