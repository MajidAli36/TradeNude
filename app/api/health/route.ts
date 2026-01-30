import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint to verify the API is working
 */
export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✓ Set" : "✗ Missing",
      SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey ? "✓ Set" : "✗ Missing",
    };

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envStatus,
      message: "API is running",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
