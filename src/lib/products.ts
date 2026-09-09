export type ProductCategory = "shirts" | "hats" | "jeans";
export type Technique = "embroidery" | "print" | "laser";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  techniques: Technique[];
  priceFrom: number;
  image: string;
  images?: string[];
  href: string;
  badge?: string;
  popular?: boolean;
  showOnHomepage?: boolean;
}

export const PRODUCTS: Product[] = [
  // ─── SHIRTS ─────────────────────────────────
  {
    id: "custom-tshirts",
    name: "Custom T-Shirts",
    description: "Ultra-vibrant full-color prints on premium cotton tees",
    category: "shirts",
    techniques: ["print", "embroidery", "laser"],
    priceFrom: 8.99,
    image: "/Shirt/florida-dtf-prints-services.png",
    href: "/design?product=tshirt",
    badge: "Best Seller",
    popular: true,
  },
  {
    id: "custom-hoodies",
    name: "Custom Hoodies",
    description: "Warm, cozy hoodies with your custom design",
    category: "shirts",
    techniques: ["print", "embroidery"],
    priceFrom: 22.99,
    image: "/Shirt/image.png",
    href: "/design?product=tshirt",
    popular: true,
  },
  {
    id: "custom-sweatshirts",
    name: "Custom Sweatshirts",
    description: "Classic crewneck sweatshirts with custom branding",
    category: "shirts",
    techniques: ["print", "embroidery"],
    priceFrom: 19.99,
    image: "/Shirt/image copy.png",
    href: "/design?product=tshirt",
  },
  {
    id: "youth-tees",
    name: "Youth Tees",
    description: "Custom tees sized for kids and teens",
    category: "shirts",
    techniques: ["print", "embroidery"],
    priceFrom: 7.99,
    image: "/Shirt/image copy 5.png",
    href: "/design?product=tshirt",
  },
  {
    id: "performance-styles",
    name: "Performance Styles",
    description: "Moisture-wicking athletic wear with custom designs",
    category: "shirts",
    techniques: ["print", "embroidery"],
    priceFrom: 12.99,
    image: "/Shirt/il_800x800.7169952703_agqz.webp",
    href: "/design?product=tshirt",
  },
  {
    id: "long-sleeve-shirts",
    name: "Long Sleeve Shirts",
    description: "Long sleeve tees for all-season custom apparel",
    category: "shirts",
    techniques: ["print", "embroidery", "laser"],
    priceFrom: 11.99,
    image: "/Shirt/image copy 3.png",
    href: "/design?product=tshirt",
  },
  {
    id: "women-shirts",
    name: "Women's Shirts",
    description: "Tailored fit women's custom tees and tops",
    category: "shirts",
    techniques: ["print", "embroidery"],
    priceFrom: 9.99,
    image: "/Shirt/women.png",
    href: "/design?product=tshirt",
  },
  {
    id: "jackets",
    name: "Custom Jackets",
    description: "Embroidered and printed custom jackets",
    category: "shirts",
    techniques: ["embroidery", "laser"],
    priceFrom: 29.99,
    image: "/Shirt/image copy 2.png",
    href: "/design?product=tshirt",
    badge: "Premium",
  },

  // ─── HATS ───────────────────────────────────
  {
    id: "embroidered-hats",
    name: "Embroidered Hats",
    description: "3D puff & flat stitch custom embroidered caps",
    category: "hats",
    techniques: ["embroidery"],
    priceFrom: 13.50,
    image: "/Shirt/landing-embroidered-patches.jpg",
    href: "/design?product=hat",
    badge: "Popular",
    popular: true,
  },
  {
    id: "printed-hats",
    name: "Printed Hats",
    description: "Seamless DTF printed custom caps",
    category: "hats",
    techniques: ["print"],
    priceFrom: 10.99,
    image: "/Shirt/DTF-Xpress-print-finished-garment.jpg",
    href: "/design?product=hat",
  },
  {
    id: "laser-hats",
    name: "Laser Patch Hats",
    description: "Premium laser-engraved leather patch hats",
    category: "hats",
    techniques: ["laser"],
    priceFrom: 15.99,
    image: "/Shirt/laser-engraved-erie-pa-patch.webp",
    href: "/design?product=hat",
    badge: "Premium",
  },
  {
    id: "snapback-hats",
    name: "Snapback Caps",
    description: "Classic snapback style with custom embroidery",
    category: "hats",
    techniques: ["embroidery", "print"],
    priceFrom: 14.50,
    image: "/hat-front.png",
    href: "/design?product=hat",
  },

  // ─── JEANS ──────────────────────────────────
  {
    id: "embroidered-jeans",
    name: "Embroidered Jeans",
    description: "Custom embroidered denim jeans with your design",
    category: "jeans",
    techniques: ["embroidery"],
    priceFrom: 34.99,
    image: "/Shirt/custom-jeans.jpg",
    href: "/design?product=tshirt",
    badge: "New",
    popular: true,
  },
  {
    id: "printed-jeans",
    name: "Printed Jeans",
    description: "DTF printed custom denim with vibrant graphics",
    category: "jeans",
    techniques: ["print"],
    priceFrom: 29.99,
    image: "/Shirt/custom-jeans.jpg",
    href: "/design?product=tshirt",
    badge: "New",
  },
  {
    id: "laser-patch-jeans",
    name: "Laser Patch Jeans",
    description: "Premium laser-engraved leather patches on denim",
    category: "jeans",
    techniques: ["laser"],
    priceFrom: 39.99,
    image: "/Shirt/custom-jeans.jpg",
    href: "/design?product=tshirt",
    badge: "New",
  },
];

export const CATEGORY_INFO: Record<ProductCategory, { label: string; description: string; iconKey: "shirts" | "hats" | "jeans" }> = {
  shirts: {
    label: "Shirts & Apparel",
    description: "T-shirts, hoodies, sweatshirts, jackets & more",
    iconKey: "shirts",
  },
  hats: {
    label: "Caps & Hats",
    description: "Embroidered, printed & laser patch caps",
    iconKey: "hats",
  },
  jeans: {
    label: "Custom Jeans",
    description: "Embroidered, printed & laser patch denim",
    iconKey: "jeans",
  },
};

export const TECHNIQUE_INFO: Record<Technique, { label: string; color: string; bg: string }> = {
  embroidery: { label: "Embroidery", color: "#7c3aed", bg: "#f5f3ff" },
  print: { label: "DTF Print", color: "#0070f3", bg: "#eff6ff" },
  laser: { label: "Laser Patch", color: "#d97706", bg: "#fffbeb" },
};
