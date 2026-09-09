export type ProductCategory = "shirts" | "hats" | "jeans";
export type Technique = "embroidery" | "print" | "laser";

export interface ProductColor {
  name: string;
  hex: string;
}

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
  defaultColor?: string;
  defaultColorHex?: string;
  colors?: ProductColor[];
}

export const COLOR_HEX_MAP: Record<string, string> = {
  "black": "#111827",
  "white": "#ffffff",
  "navy blue": "#1e3a8a",
  "navy": "#1e3a8a",
  "heather grey": "#9ca3af",
  "grey": "#9ca3af",
  "gray": "#9ca3af",
  "royal blue": "#2563eb",
  "blue": "#2563eb",
  "forest green": "#166534",
  "green": "#166534",
  "#006400": "#006400",
  "crimson red": "#dc2626",
  "red": "#dc2626",
  "maroon": "#800000",
  "charcoal": "#334155",
  "denim blue": "#2563eb",
  "dark blue": "#1e3a8a",
  "black denim": "#1e293b",
  "light wash": "#60a5fa",
  "as pictured": "#1e293b",
  "original": "#1e293b",
  "as shown": "#1e293b",
  "silver / steel": "#94a3b8",
  "silver": "#94a3b8",
};

export function getColorHex(colorNameOrHex?: string, fallbackHex?: string): string {
  if (!colorNameOrHex) return fallbackHex || "#ffffff";
  const trimmed = colorNameOrHex.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb")) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (COLOR_HEX_MAP[lower]) {
    return COLOR_HEX_MAP[lower];
  }
  if (fallbackHex && (fallbackHex.startsWith("#") || fallbackHex.startsWith("rgb"))) {
    return fallbackHex;
  }
  return "#111827";
}

export const HEX_TO_NAME_MAP: Record<string, string> = {
  "#ffffff": "White",
  "#000000": "Black",
  "#111827": "Black",
  "#1e3a8a": "Navy Blue",
  "#000080": "Navy Blue",
  "#2563eb": "Royal Blue",
  "#0056b3": "Classic Blue",
  "#9ca3af": "Heather Grey",
  "#e0e0e0": "Light Grey",
  "#d3d3d3": "Grey",
  "#166534": "Forest Green",
  "#006400": "Forest Green",
  "#008000": "Green",
  "#dc2626": "Crimson Red",
  "#8b0000": "Dark Red",
  "#ff0000": "Red",
  "#ff4500": "Orange Red",
  "#ff8c00": "Dark Orange",
  "#ffc107": "Amber",
  "#f5f5dc": "Beige",
  "#f5deb3": "Wheat",
  "#4b0082": "Indigo",
  "#9370db": "Purple",
  "#ff69b4": "Hot Pink",
  "#334155": "Charcoal",
  "#1e293b": "Slate / As Pictured",
  "#94a3b8": "Silver / Steel",
};

export function getColorName(colorNameOrHex?: string): string {
  if (!colorNameOrHex) return "White";
  const trimmed = colorNameOrHex.trim();
  const lower = trimmed.toLowerCase();
  if (HEX_TO_NAME_MAP[lower]) {
    return HEX_TO_NAME_MAP[lower];
  }
  if (!trimmed.startsWith("#")) {
    return trimmed;
  }
  return trimmed;
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
    defaultColor: "White",
    defaultColorHex: "#ffffff",
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
    defaultColor: "Black",
    defaultColorHex: "#111827",
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
    defaultColor: "Heather Grey",
    defaultColorHex: "#9ca3af",
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
    defaultColor: "White",
    defaultColorHex: "#ffffff",
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
    defaultColor: "Navy Blue",
    defaultColorHex: "#1e3a8a",
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
    defaultColor: "Crimson Red",
    defaultColorHex: "#dc2626",
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
    defaultColor: "White",
    defaultColorHex: "#ffffff",
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
    defaultColor: "Black",
    defaultColorHex: "#111827",
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
    defaultColor: "Black",
    defaultColorHex: "#111827",
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
    defaultColor: "Heather Grey",
    defaultColorHex: "#9ca3af",
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
    defaultColor: "Charcoal",
    defaultColorHex: "#334155",
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
    defaultColor: "Black",
    defaultColorHex: "#111827",
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
    defaultColor: "Denim Blue",
    defaultColorHex: "#2563eb",
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
    defaultColor: "Denim Blue",
    defaultColorHex: "#2563eb",
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
    defaultColor: "Denim Blue",
    defaultColorHex: "#2563eb",
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
