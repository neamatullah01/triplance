import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(req: NextRequest) {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  const { searchParams } = req.nextUrl;
  const searchTerm = searchParams.get("searchTerm") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "12";

  try {
    // Fetch all suggestions (no server-side pagination since we paginate client-side)
    const res = await fetch(`${env.API_URL}/users/suggestions`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ success: false, data: [], meta: { total: 0, page: 1, limit: 12 } });
    }

    // Apply client-side search filtering
    let results: any[] = Array.isArray(data.data) ? data.data : [];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(q) ||
          u.bio?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    // Apply pagination
    const total = results.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const paginated = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return NextResponse.json({
      success: true,
      data: paginated,
      meta: { total, page: pageNum, limit: limitNum },
    });
  } catch (error) {
    console.error("Explorers API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
