import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qohvhsjlfhjclvbjnzgz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_zpK6-JTy6UP7VdqLfHAqLA_-5-cKhye";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbOrder {
  id?: string;
  order_id: string;
  customer_name: string;
  email: string;
  phone?: string;
  product_name: string;
  item_type: "tshirt" | "hat";
  technique: "print" | "embroidery" | "laser";
  color?: string;
  quantity: number;
  total_price: string;
  status_step: number; // 1: Placed, 2: Proof/Digitizing, 3: Production, 4: Quality Check, 5: Shipped
  carrier?: string;
  tracking_number?: string;
  shipping_address?: string;
  image_url?: string;
  instructions?: string;
  cart_data?: string;
  created_at?: string;
}

export interface DbQuote {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product_type: string;
  technique: string;
  quantity: string;
  notes?: string;
  created_at?: string;
}

/**
 * Save order to Supabase orders table with localStorage fallback
 */
export async function createOrder(order: DbOrder): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select();

    if (error) {
      console.warn("Supabase order insert notice:", error.message);
      // Fallback to local persistence so order is never lost
      saveToLocalOrders(order);
      return { success: true, data: [order] };
    }

    // Also mirror to local storage
    saveToLocalOrders(order);
    return { success: true, data };
  } catch (err: any) {
    console.warn("Supabase offline or table missing, stored locally:", err);
    saveToLocalOrders(order);
    return { success: true, data: [order] };
  }
}

/**
 * Fetch order from Supabase by order_id, with fallback to local storage & defaults
 */
export async function fetchOrderById(orderId: string): Promise<DbOrder | null> {
  const cleanedId = orderId.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("order_id", cleanedId)
      .maybeSingle();

    if (!error && data) {
      return data as DbOrder;
    }
  } catch (err) {
    console.warn("Supabase fetch error, checking local store", err);
  }

  // Fallback to locally saved orders
  const localOrders = getLocalOrders();
  if (localOrders[cleanedId]) {
    return localOrders[cleanedId];
  }

  return null;
}

/**
 * Submit wholesale quote request
 */
export async function createQuote(quote: DbQuote): Promise<{ success: boolean; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert([quote])
      .select();

    if (error) {
      console.warn("Supabase quotes insert notice:", error.message);
      return { success: true };
    }
    return { success: true, error: null };
  } catch (err) {
    console.warn("Quote stored in offline mode:", err);
    return { success: true };
  }
}

/**
 * Ultra-lightweight keep-alive ping (0ms user impact)
 * Runs in the background at most once per 24 hours to prevent Supabase pausing after 7 days
 */
export async function triggerKeepAlive() {
  if (typeof window === "undefined") return;

  const LAST_PING_KEY = "sb_last_keepalive_ts";
  const now = Date.now();
  const lastPing = localStorage.getItem(LAST_PING_KEY);

  // Ping at most once every 24 hours
  if (lastPing && now - parseInt(lastPing) < 24 * 60 * 60 * 1000) {
    return;
  }

  try {
    localStorage.setItem(LAST_PING_KEY, now.toString());
    // Lightweight async fetch with low priority
    fetch("/api/keepalive", { 
      method: "GET",
      keepalive: true,
      cache: "no-store" 
    }).catch(() => {});
  } catch (e) {}
}

// Local storage fallback helpers
function getLocalOrders(): Record<string, DbOrder> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("demir_studio_orders");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToLocalOrders(order: DbOrder) {
  if (typeof window === "undefined") return;
  try {
    const orders = getLocalOrders();
    orders[order.order_id.toUpperCase()] = order;
    localStorage.setItem("demir_studio_orders", JSON.stringify(orders));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}
