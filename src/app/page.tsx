import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShippingStats from "@/components/ShippingStats";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Hero />
        <ShippingStats />
      </main>
    </div>
  );
}
