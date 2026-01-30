import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Simple test endpoint to verify the app is working
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Application is running",
    timestamp: new Date().toISOString(),
  });
}
