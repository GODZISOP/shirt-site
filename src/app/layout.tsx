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
  title: "Cheap Custom T-Shirt Printing at Any Quantity | Demir Studio",
  description: "Custom t-shirts for less! Demir Studio is the leader in affordable t-shirt printing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Audiowide&family=Bebas+Neue&family=Black+Ops+One&family=Bungee&family=Caveat:wght@400..700&family=Cinzel:wght@400..700&family=Creepster&family=Dancing+Script:wght@400..700&family=Fascinate&family=Graduate&family=Great+Vibes&family=Lato:ital,wght@0,300;0,400;0,700;1,300&family=Lobster&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Montserrat:ital,wght@0,300..800;1,300..800&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Orbitron:wght@400..900&family=Oswald:wght@300..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Press+Start+2P&family=Rajdhani:wght@400;600;700&family=Righteous&family=Roboto:ital,wght@0,300;0,400;0,700;1,300&family=Russo+One&family=Satisfy&family=Syncopate:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-dvh isolate font-sans">
        {children}
      </body>
    </html>
  );
}
