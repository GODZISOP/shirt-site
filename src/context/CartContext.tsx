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
  productType?: "tshirt" | "hat";
  technique?: "print" | "embroidery" | "laser";
  pricingBreakdown?: {
    basePrice: number;
    decorationPrice: number;
  };
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
    let rawTotal = cart.reduce((total, item) => total + parseFloat(item.totalPrice || "0"), 0);
    
    // Calculate total quantity across all items
    let totalQty = 0;
    cart.forEach(item => {
      if (item.quantities) {
        Object.values(item.quantities).forEach(qty => {
          totalQty += (parseInt(qty as any) || 0);
        });
      }
    });

    // Apply wholesale discounts based on total quantity
    let discountMultiplier = 1;
    if (totalQty >= 100) discountMultiplier = 0.75; // 25% off
    else if (totalQty >= 50) discountMultiplier = 0.82; // 18% off
    else if (totalQty >= 25) discountMultiplier = 0.90; // 10% off

    return rawTotal * discountMultiplier;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
