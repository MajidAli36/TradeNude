import { NextRequest, NextResponse } from "next/server";
import { deleteProfileById } from "../../../../../lib/server-profiles";
import { validateAdminRequest } from "../../utils";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = validateAdminRequest(req);
  if (authError) return authError;

  const { id } = await params;

  const deleted = await deleteProfileById(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Profile deleted" });
}

