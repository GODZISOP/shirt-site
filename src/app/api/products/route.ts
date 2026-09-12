import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import * as fs from "fs";
import * as path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_products.json");
const OVERRIDES_FILE = path.join(process.cwd(), "src", "data", "product_overrides.json");

function readLocalProducts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.warn("Failed to read local products JSON:", err);
    return [];
  }
}

function writeLocalProducts(products: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write local products JSON:", err);
  }
}

function readOverrides(): Record<string, any> {
  try {
    if (!fs.existsSync(OVERRIDES_FILE)) return {};
    const content = fs.readFileSync(OVERRIDES_FILE, "utf-8");
    return JSON.parse(content || "{}");
  } catch (err) {
    console.warn("Failed to read product overrides:", err);
    return {};
  }
}

function writeOverrides(overrides: Record<string, any>) {
  try {
    const dir = path.dirname(OVERRIDES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write product overrides:", err);
  }
}

// Timeout helper so Supabase calls never delay or freeze API
async function withTimeout<T>(promiseLike: PromiseLike<T>, ms = 1200): Promise<T | null> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export async function GET() {
  let dbProducts: any[] = [];
  try {
    const result: any = await withTimeout(
      supabase.from("products").select("*").order("created_at", { ascending: false })
    );

    if (result && !result.error && Array.isArray(result.data)) {
      dbProducts = result.data;
    }
  } catch (err) {
    console.warn("Supabase products fetch failed:", err);
  }

  // Merge with local fallback
  const localProducts = readLocalProducts();
  const overrides = readOverrides();
  const mergedMap = new Map<string, any>();

  // Add local first
  for (const p of localProducts) {
    mergedMap.set(p.id, p);
  }
  // Overlay DB products
  for (const p of dbProducts) {
    mergedMap.set(p.id, p);
  }

  // Apply overrides to custom products if any
  const customList = Array.from(mergedMap.values()).map((p) => {
    if (overrides[p.id]) {
      return { ...p, ...overrides[p.id] };
    }
    return p;
  });

  return NextResponse.json({
    success: true,
    products: customList,
    overrides,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, techniques, priceFrom, image, images, badge, showOnHomepage } = body;

    if (!name || !category || !priceFrom) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const cleanImages: string[] = Array.isArray(images)
      ? images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
      : [];
    const primaryImage = image?.trim() || cleanImages[0] || "/Shirt/florida-dtf-prints-services.png";
    const allImages = cleanImages.length > 0 ? cleanImages : [primaryImage];

    const newProduct = {
      id: body.id || `custom-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || "",
      category,
      techniques: Array.isArray(techniques) && techniques.length > 0 ? techniques : ["print"],
      priceFrom: parseFloat(priceFrom) || 9.99,
      image: primaryImage,
      images: allImages,
      href: `/design?product=${category === "hats" ? "hat" : "tshirt"}`,
      badge: badge?.trim() || "New",
      popular: false,
      showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
      created_at: new Date().toISOString(),
    };

    // 1. Try Supabase with non-blocking timeout
    withTimeout(supabase.from("products").insert([newProduct]), 1000).catch(() => {});

    // 2. Persist locally to json file immediately
    const local = readLocalProducts();
    local.unshift(newProduct);
    writeLocalProducts(local);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, image, images, name, priceFrom, description, category, techniques, badge, showOnHomepage } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 });
    }

    const cleanImages: string[] | undefined = Array.isArray(images)
      ? images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
      : undefined;
    const primaryImage = image?.trim() || (cleanImages && cleanImages.length > 0 ? cleanImages[0] : undefined);

    const updatesObj: Record<string, any> = {};
    if (primaryImage !== undefined) updatesObj.image = primaryImage;
    if (cleanImages !== undefined) updatesObj.images = cleanImages;
    if (name !== undefined) updatesObj.name = name.trim();
    if (priceFrom !== undefined) updatesObj.priceFrom = parseFloat(priceFrom) || 0;
    if (description !== undefined) updatesObj.description = description.trim();
    if (category !== undefined) updatesObj.category = category;
    if (techniques !== undefined && Array.isArray(techniques)) updatesObj.techniques = techniques;
    if (badge !== undefined) updatesObj.badge = badge.trim();
    if (showOnHomepage !== undefined) updatesObj.showOnHomepage = Boolean(showOnHomepage);
    updatesObj.updated_at = new Date().toISOString();

    // 1. Update overrides file (applies to both default and custom products!)
    const overrides = readOverrides();
    overrides[id] = {
      ...(overrides[id] || {}),
      ...updatesObj,
    };
    writeOverrides(overrides);

    // 2. If it is in custom_products, update in-place too
    const local = readLocalProducts();
    const customIdx = local.findIndex((p: any) => p.id === id);
    if (customIdx !== -1) {
      local[customIdx] = {
        ...local[customIdx],
        ...updatesObj,
      };
      writeLocalProducts(local);
    }

    // 3. Try updating Supabase non-blockingly
    const dbUpdatePayload: Record<string, any> = {};
    if (primaryImage) dbUpdatePayload.image = primaryImage;
    if (name) dbUpdatePayload.name = name.trim();
    if (priceFrom) dbUpdatePayload.priceFrom = parseFloat(priceFrom);
    if (description !== undefined) dbUpdatePayload.description = description.trim();
    if (category) dbUpdatePayload.category = category;
    if (techniques) dbUpdatePayload.techniques = techniques;
    if (badge !== undefined) dbUpdatePayload.badge = badge.trim();
    if (showOnHomepage !== undefined) dbUpdatePayload.showOnHomepage = Boolean(showOnHomepage);

    if (Object.keys(dbUpdatePayload).length > 0) {
      withTimeout(supabase.from("products").update(dbUpdatePayload).eq("id", id), 1000).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      id,
      updates: updatesObj,
      overrides,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    // 1. Try Supabase with non-blocking timeout
    withTimeout(supabase.from("products").delete().eq("id", id), 1000).catch(() => {});

    // 2. Remove locally immediately
    const local = readLocalProducts();
    const updated = local.filter((p: any) => p.id !== id);
    writeLocalProducts(updated);

    // 3. Remove from overrides
    const overrides = readOverrides();
    if (overrides[id]) {
      delete overrides[id];
      writeOverrides(overrides);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
