/**
 * Migration Runner Script
 * 
 * This script runs SQL migrations against your Supabase database.
 * 
 * Usage:
 *   npx tsx scripts/run-migration.ts migrations/001_add_title_column.sql
 * 
 * Or set up as npm script:
 *   npm run migrate
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { getSupabaseClient } from '../lib/supabase';

async function runMigration(migrationFile: string) {
  try {
    console.log(`📦 Running migration: ${migrationFile}`);
    
    // Read SQL file
    const sqlPath = join(process.cwd(), migrationFile);
    const sql = readFileSync(sqlPath, 'utf-8');
    
    if (!sql.trim()) {
      throw new Error('Migration file is empty');
    }
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Split SQL by semicolons and execute each statement
    // Note: Supabase JS client doesn't support raw SQL directly
    // We need to use RPC or execute via REST API
    
    console.log('⚠️  Note: Supabase JS client has limited raw SQL support.');
    console.log('📋 Please run this SQL manually in Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log(sql);
    console.log('='.repeat(60) + '\n');
    
    // Alternative: Use Supabase REST API for raw SQL (requires service role key)
    // For now, we'll just output the SQL for manual execution
    
    console.log('✅ Migration SQL prepared. Copy and run in Supabase SQL Editor.');
    console.log('   Go to: Supabase Dashboard → SQL Editor → New Query');
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Get migration file from command line
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please provide a migration file path');
  console.log('Usage: npx tsx scripts/run-migration.ts migrations/001_add_title_column.sql');
  process.exit(1);
}

runMigration(migrationFile);
