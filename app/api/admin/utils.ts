import { NextRequest, NextResponse } from "next/server";

export function validateAdminRequest(req: NextRequest):
  | NextResponse
  | null {
  const authHeader = req.headers.get("authorization") || "";
  const headerSecret =
    authHeader.startsWith("Bearer ") && authHeader.length > 7
      ? authHeader.slice(7)
      : null;

  const altHeader = req.headers.get("x-admin-secret");

  const expected =
    process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET;

  if (!expected) {
    // If no server-side secret is configured, allow all requests (development only).
    return null;
  }

  const provided = headerSecret || altHeader;

  if (!provided || provided !== expected) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}

