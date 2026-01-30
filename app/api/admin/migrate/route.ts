import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "../utils";
import { readFileSync } from "fs";
import { join } from "path";
import { getSupabaseClient } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Admin-only endpoint to run database migrations
 * 
 * Usage:
 * POST /api/admin/migrate
 * Body: { migrationFile: "migrations/001_add_title_column.sql" }
 * 
 * ⚠️ SECURITY: Only accessible with admin secret
 */
export async function POST(req: NextRequest) {
  try {
    // Validate admin access
    const authError = validateAdminRequest(req);
    if (authError) return authError;

    const body = await req.json();
    const { migrationFile } = body;

    if (!migrationFile) {
      return NextResponse.json(
        { error: "migrationFile is required" },
        { status: 400 }
      );
    }

    console.log(`📦 Running migration: ${migrationFile}`);

    // Read SQL file
    const sqlPath = join(process.cwd(), migrationFile);
    const sql = readFileSync(sqlPath, 'utf-8');

    if (!sql.trim()) {
      return NextResponse.json(
        { error: "Migration file is empty" },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Note: Supabase JS client doesn't support raw SQL execution directly
    // We need to use the REST API or RPC functions
    // For now, return the SQL to be executed manually
    
    return NextResponse.json({
      success: true,
      message: "Migration SQL prepared. Please execute manually in Supabase SQL Editor.",
      sql: sql,
      instructions: [
        "1. Go to Supabase Dashboard → SQL Editor",
        "2. Click 'New Query'",
        "3. Paste the SQL below",
        "4. Click 'Run'",
      ],
    });

  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run migration" },
      { status: 500 }
    );
  }
}
