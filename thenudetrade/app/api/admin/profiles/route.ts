import { NextRequest, NextResponse } from "next/server";
import { listAdminProfiles } from "../../../../lib/server-profiles";
import type { Status } from "../../../../types";
import { validateAdminRequest } from "../utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authError = validateAdminRequest(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "pending") as Status;

    const profiles = await listAdminProfiles(statusParam);
    return NextResponse.json({ profiles });
  } catch (error: any) {
    console.error("Error in GET /api/admin/profiles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin profiles" },
      { status: 500 }
    );
  }
}

