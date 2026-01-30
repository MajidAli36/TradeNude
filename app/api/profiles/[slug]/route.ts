import { NextRequest, NextResponse } from "next/server";
import { findProfileBySlug } from "../../../../lib/server-profiles";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const profile = await findProfileBySlug(slug);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Error in GET /api/profiles/[slug]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

