import { NextRequest, NextResponse } from "next/server";
import {
  listPublicProfiles,
  createProfileFromFormData,
} from "../../../lib/server-profiles";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const gender = searchParams.get("gender") || undefined;
  const city = searchParams.get("city") || undefined;
  const country = searchParams.get("country") || undefined;

  const profiles = await listPublicProfiles({
    gender: gender as any,
    city: city || undefined,
    country: country || undefined,
  });

  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const profile = await createProfileFromFormData(formData);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create profile" },
      { status: 400 }
    );
  }
}

