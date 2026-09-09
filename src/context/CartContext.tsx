"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { get, set, del } from 'idb-keyval';

export interface CartItem {
  id: string;
  shirtColor?: string;
  quantities?: Record<string, number>;
  pricePerShirt?: number;
  totalPrice?: string;
  frontImage?: string;
  backImage?: string;
  leftImage?: string;
  rightImage?: string;
  productType?: "tshirt" | "hat" | "jeans" | string;
  technique?: "print" | "embroidery" | "laser" | string;
  pricingBreakdown?: {
    basePrice: number;
    decorationPrice: number;
  };
  productName?: string;
  productId?: string;
  category?: string;
  notes?: string;
  isCustomDesign?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage / idb on initial render
  useEffect(() => {
    // Check IndexedDB first
    get("cartData").then((savedCart) => {
      if (savedCart) {
        setCart(savedCart);
      } else {
        // Fallback to localStorage for backward compatibility, then migrate to IDB
        const oldSaved = localStorage.getItem("cartData");
        if (oldSaved) {
          try {
            const parsed = JSON.parse(oldSaved);
            setCart(parsed);
            set("cartData", parsed); // Migrate to IDB
            localStorage.removeItem("cartData"); // Clean up old
          } catch (e) {
            console.error("Failed to parse old cart data", e);
          }
        }
      }
      setIsLoaded(true);
    }).catch((e) => {
      console.error("Failed to load cart from IDB", e);
      setIsLoaded(true);
    });
  }, []);

  // Save to IDB whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      set("cartData", cart).catch(e => console.error("Failed to save cart to IDB", e));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    del("cartData").catch(console.error);
    localStorage.removeItem("cartData");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const { finalTotal } = calculateItemDiscount(item);
      return total + finalTotal;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Per-Item Bulk Discount Helpers ───────────────
export function getItemDiscountRate(qty: number): number {
  if (qty >= 100) return 0.25; // 25% off for 100+ units of this product
  if (qty >= 50) return 0.18;  // 18% off for 50+ units of this product
  if (qty >= 25) return 0.10;  // 10% off for 25+ units of this product
  return 0;                    // 0% off for < 25 units
}

export function calculateItemDiscount(item: CartItem): {
  qty: number;
  rawTotal: number;
  discountRate: number;
  discountAmount: number;
  finalTotal: number;
  effectiveUnitPrice: number;
} {
  const qty = item.quantities
    ? Object.values(item.quantities).reduce((a, b) => a + (parseInt(b as any) || 0), 0)
    : 1;
  const rawTotal = parseFloat(item.totalPrice || "0");
  const discountRate = getItemDiscountRate(qty);
  const discountAmount = rawTotal * discountRate;
  const finalTotal = rawTotal - discountAmount;
  const effectiveUnitPrice = qty > 0 ? finalTotal / qty : rawTotal;

  return {
    qty,
    rawTotal,
    discountRate,
    discountAmount,
    finalTotal,
    effectiveUnitPrice,
  };
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
