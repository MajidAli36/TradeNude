/**
 * Migration Runner via Supabase REST API
 * 
 * This script runs SQL migrations using Supabase REST API.
 * Requires SUPABASE_SERVICE_ROLE_KEY environment variable.
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/migrate-via-api.ts migrations/001_add_title_column.sql
 */

import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrationViaAPI(migrationFile: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    
    console.log(`📦 Running migration: ${migrationFile}`);
    
    // Read SQL file
    const sqlPath = join(process.cwd(), migrationFile);
    const sql = readFileSync(sqlPath, 'utf-8');
    
    if (!sql.trim()) {
      throw new Error('Migration file is empty');
    }
    
    // Use Supabase REST API to execute SQL
    // Note: This requires using the PostgREST API or Management API
    // For security, we'll use the Management API endpoint
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ sql }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${error}`);
    }
    
    console.log('✅ Migration executed successfully!');
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Alternative: Run the SQL manually in Supabase SQL Editor');
    process.exit(1);
  }
}

// Get migration file from command line
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please provide a migration file path');
  console.log('Usage: SUPABASE_SERVICE_ROLE_KEY=key npx tsx scripts/migrate-via-api.ts migrations/001_add_title_column.sql');
  process.exit(1);
}

runMigrationViaAPI(migrationFile);
