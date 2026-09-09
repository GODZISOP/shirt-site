"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PRODUCTS, type Product } from "./products";

const LOCAL_STORAGE_KEY = "demir_studio_custom_products";
const OVERRIDES_STORAGE_KEY = "demir_studio_product_overrides";

export function useProducts() {
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Partial<Product>>>({});
  const [loading, setLoading] = useState(false);

  // Load from local storage initially for instant display
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setCustomProducts(JSON.parse(cached));
      }
      const cachedOverrides = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (cachedOverrides) {
        setOverrides(JSON.parse(cachedOverrides));
      }
    } catch {}
  }, []);

  // Fetch latest from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.products)) {
            setCustomProducts(data.products);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.products));
          }
          if (data.overrides && typeof data.overrides === "object") {
            setOverrides(data.overrides);
            localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(data.overrides));
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch custom products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Combined products with overrides applied (image, name, price etc.)
  const allProducts = useMemo<Product[]>(() => {
    return [...customProducts, ...PRODUCTS]
      .filter((p) => !overrides[p.id]?.deleted)
      .map((p) => {
        if (overrides[p.id]) {
          return { ...p, ...overrides[p.id] };
        }
        return p;
      });
  }, [customProducts, overrides]);

  // Add product
  const addProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success && data.product) {
        const updated = [data.product, ...customProducts];
        setCustomProducts(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return { success: true, product: data.product };
      }
      return { success: false, error: data.error || "Failed to add product" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Live sync across tabs/components
  useEffect(() => {
    const handleUpdate = (e: any) => {
      const { id, image, images, showOnHomepage } = e.detail || {};
      if (id) {
        setOverrides((prev) => ({
          ...prev,
          [id]: {
            ...(prev[id] || {}),
            ...(image ? { image } : {}),
            ...(images ? { images } : {}),
            ...(showOnHomepage !== undefined ? { showOnHomepage } : {}),
          },
        }));
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("product_image_updated", handleUpdate);
      window.addEventListener("product_homepage_toggled", handleUpdate);
      return () => {
        window.removeEventListener("product_image_updated", handleUpdate);
        window.removeEventListener("product_homepage_toggled", handleUpdate);
      };
    }
  }, []);

  // Toggle Show on Homepage
  const toggleHomepageVisibility = async (id: string, show: boolean) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, showOnHomepage: show }),
      });
      const data = await res.json();
      if (data.success) {
        const newOverrides = {
          ...overrides,
          [id]: { ...(overrides[id] || {}), showOnHomepage: show },
        };
        setOverrides(newOverrides);
        localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(newOverrides));
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("product_homepage_toggled", { detail: { id, showOnHomepage: show } })
          );
        }
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to update homepage status" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update multiple Product Images & primary cover
  const updateProductImages = async (id: string, images: string[], primaryImage?: string) => {
    const mainImg = primaryImage || (images.length > 0 ? images[0] : "");
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, image: mainImg, images }),
      });
      const data = await res.json();
      if (data.success) {
        const newOverrides = {
          ...overrides,
          [id]: { ...(overrides[id] || {}), image: mainImg, images },
        };
        setOverrides(newOverrides);
        localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(newOverrides));
        // Dispatch custom window event so other components update live
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("product_image_updated", { detail: { id, image: mainImg, images } })
          );
        }
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to update images" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update single Product Image (convenience wrapper)
  const updateProductImage = async (id: string, newImageUrl: string) => {
    return updateProductImages(id, [newImageUrl], newImageUrl);
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const updated = customProducts.filter((p) => p.id !== id);
        setCustomProducts(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to delete product" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    products: allProducts,
    customProducts,
    defaultProducts: PRODUCTS,
    overrides,
    loading,
    refresh: fetchProducts,
    addProduct,
    updateProductImage,
    updateProductImages,
    toggleHomepageVisibility,
    deleteProduct,
  };
}
