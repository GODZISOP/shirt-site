import React from "react";
import { Shirt, ShoppingBag, type LucideProps } from "lucide-react";

interface CategoryIconProps extends LucideProps {
  category: "shirts" | "hats" | "jeans" | "all" | string;
}

export default function CategoryIcon({ category, size = 18, className = "", ...props }: CategoryIconProps) {
  const norm = category?.toLowerCase();

  if (norm === "shirts" || norm === "shirt") {
    return <Shirt size={size} className={className} strokeWidth={2} {...props} />;
  }

  if (norm === "hats" || norm === "hat") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Baseball cap outline */}
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="M2 17h16c2.5 0 4.5 1 4.5 2.5s-2 2.5-4.5 2.5H6" />
        <circle cx="12" cy="9" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (norm === "jeans" || norm === "jean" || norm === "pants") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Denim jeans / pants outline */}
        <path d="M5 4h14v3l-2 13h-4l-1-9-1 9H7L5 7V4z" />
        <path d="M5 7h14" />
        <path d="M12 4v4" />
      </svg>
    );
  }

  return <ShoppingBag size={size} className={className} strokeWidth={2} {...props} />;
}
