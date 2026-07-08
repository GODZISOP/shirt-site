import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheap Custom T-Shirt Printing at Any Quantity | ooShirts",
  description: "Custom t-shirts for less! ooShirts is the leader in affordable t-shirt printing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable}`}>
      <body className="antialiased min-h-dvh isolate font-sans">
        {children}
      </body>
    </html>
  );
}
