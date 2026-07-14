import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white py-16 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-4 lg:px-[30px] flex flex-col gap-12">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-gray-800">
          <p className="text-xl md:text-2xl font-bold font-roboto-slab max-w-[500px] leading-tight">
            Demir Studio makes it easy and affordable to design custom T shirts. Whether you're ordering one or a thousand shirts, we'll help you save on your order.
          </p>
          <Link
            href="#"
            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            Start Designing
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Contact Us Column */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <h4 className="font-bold text-sm tracking-widest uppercase">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <span className="text-xs text-gray-400">Call</span>
              <Link href="tel:8882571918" className="px-4 py-2 bg-gray-800 rounded-md text-sm hover:bg-gray-700 transition-colors inline-block w-fit">
                888-257-1918
              </Link>
              <Link href="mailto:help@ooshirts.com" className="px-4 py-2 bg-gray-800 rounded-md text-sm hover:bg-gray-700 transition-colors mt-2 inline-block w-fit">
                help@demirstudio.com
              </Link>
            </div>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Sitemap</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">T-Shirt Quotes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">T-Shirt Designs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Services We Offer</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shirt Brands</Link></li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Helpful Links</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Retrieve a design</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Track an order</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Get a quote</Link></li>
            </ul>
          </div>

          {/* Learn More */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Learn More</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Locations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Company Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Custom Products */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Custom Products</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Cheap Sweatshirts</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cheap Hoodies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cheap Youth T-Shirts</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cheap Women's T-Shirts</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 gap-4">
          <p className="text-xs text-gray-500">© 2024 Demir Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>

      </div>

      {/* Floating Action Buttons (Sticky) */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
        <Link href="#" className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors text-sm">
          Get a quote
        </Link>
        <button className="w-12 h-12 bg-[#00AEEF] rounded-full flex items-center justify-center shadow-lg hover:bg-[#009CE0] transition-colors">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </footer>
  );
}
