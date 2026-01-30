import { NextRequest, NextResponse } from "next/server";
import { updateProfileStatus } from "../../../../../../lib/server-profiles";
import { validateAdminRequest } from "../../../utils";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const authError = validateAdminRequest(req);
  if (authError) return authError;

  const { id } = await params;

  const profile = await updateProfileStatus(id, "rejected");
  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile });
}

