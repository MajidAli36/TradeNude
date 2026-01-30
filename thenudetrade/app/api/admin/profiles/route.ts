import { NextRequest, NextResponse } from "next/server";
import { listAdminProfiles } from "../../../../lib/server-profiles";
import type { Status } from "../../../../types";
import { validateAdminRequest } from "../utils";

export async function GET(req: NextRequest) {
  const authError = validateAdminRequest(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const statusParam = (searchParams.get("status") || "pending") as Status;

  const profiles = await listAdminProfiles(statusParam);
  return NextResponse.json({ profiles });
}

