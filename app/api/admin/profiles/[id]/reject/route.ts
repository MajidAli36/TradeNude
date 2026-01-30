import { NextRequest, NextResponse } from "next/server";
import { updateProfileStatus } from "../../../../../../lib/server-profiles";
import { validateAdminRequest } from "../../../utils";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
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
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/profiles/[id]/reject:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject profile" },
      { status: 500 }
    );
  }
}

