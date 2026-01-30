import { NextRequest, NextResponse } from "next/server";
import { findProfileBySlug } from "../../../../lib/server-profiles";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const profile = await findProfileBySlug(slug);

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile });
}

