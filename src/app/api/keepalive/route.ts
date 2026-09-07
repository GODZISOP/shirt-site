import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qohvhsjlfhjclvbjnzgz.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_zpK6-JTy6UP7VdqLfHAqLA_-5-cKhye";

  try {
    // Ping Supabase API gateway health endpoint (registers active API traffic)
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
      },
      cache: "no-store",
    });

    return NextResponse.json({
      status: "ok",
      supabaseStatus: res.status,
      timestamp: new Date().toISOString(),
      message: "Supabase keep-alive ping successful"
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message },
      { status: 500 }
    );
  }
}
