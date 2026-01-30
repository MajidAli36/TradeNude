/**
 * Migration Manager
 * 
 * Manages all database migrations for the project.
 * 
 * Usage:
 *   npm run migrate                    # Run all pending migrations
 *   npm run migrate -- --list          # List all migrations
 *   npm run migrate -- --status        # Check migration status
 *   npm run migrate -- migrations/001_add_title_column.sql  # Run specific migration
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getSupabaseClient } from '../lib/supabase';

interface Migration {
  file: string;
  name: string;
  sql: string;
}

const MIGRATIONS_DIR = join(process.cwd(), 'migrations');
const MIGRATION_LOG_FILE = join(process.cwd(), '.migrations_log.json');

// Load migration log
function loadMigrationLog(): string[] {
  if (existsSync(MIGRATION_LOG_FILE)) {
    try {
      const content = readFileSync(MIGRATION_LOG_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
  return [];
}

// Save migration log
function saveMigrationLog(migrations: string[]) {
  writeFileSync(MIGRATION_LOG_FILE, JSON.stringify(migrations, null, 2));
}

// Get all migration files
function getMigrationFiles(): string[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    console.log('📁 Creating migrations directory...');
    return [];
  }
  
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  return files;
}

// Load migration
function loadMigration(filename: string): Migration {
  const filePath = join(MIGRATIONS_DIR, filename);
  
  if (!existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filename}`);
  }
  
  const sql = readFileSync(filePath, 'utf-8');
  
  return {
    file: filename,
    name: filename.replace('.sql', ''),
    sql: sql.trim(),
  };
}

// Display SQL for manual execution
function displayMigration(migration: Migration) {
  console.log('\n' + '='.repeat(70));
  console.log(`📦 Migration: ${migration.name}`);
  console.log('='.repeat(70));
  console.log('\n📋 SQL to execute:\n');
  console.log(migration.sql);
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Instructions:');
  console.log('1. Copy the SQL above');
  console.log('2. Go to Supabase Dashboard → SQL Editor → New Query');
  console.log('3. Paste the SQL and click "Run"');
  console.log('4. After successful execution, run: npm run migrate -- --mark-completed ' + migration.file);
  console.log('\n');
}

// Mark migration as completed
function markCompleted(filename: string) {
  const log = loadMigrationLog();
  if (!log.includes(filename)) {
    log.push(filename);
    saveMigrationLog(log);
    console.log(`✅ Marked ${filename} as completed`);
  } else {
    console.log(`ℹ️  ${filename} is already marked as completed`);
  }
}

// List all migrations
function listMigrations() {
  const files = getMigrationFiles();
  const completed = loadMigrationLog();
  
  console.log('\n📋 All Migrations:\n');
  
  if (files.length === 0) {
    console.log('   No migrations found');
    return;
  }
  
  files.forEach((file, index) => {
    const isCompleted = completed.includes(file);
    const status = isCompleted ? '✅ Completed' : '⏳ Pending';
    console.log(`   ${index + 1}. ${file} - ${status}`);
  });
  
  console.log('\n');
}

// Check migration status
function checkStatus() {
  const files = getMigrationFiles();
  const completed = loadMigrationLog();
  const pending = files.filter(f => !completed.includes(f));
  
  console.log('\n📊 Migration Status:\n');
  console.log(`   Total migrations: ${files.length}`);
  console.log(`   Completed: ${completed.length}`);
  console.log(`   Pending: ${pending.length}`);
  
  if (pending.length > 0) {
    console.log('\n   Pending migrations:');
    pending.forEach(file => {
      console.log(`     - ${file}`);
    });
  }
  
  console.log('\n');
}

// Run specific migration
async function runMigration(filename: string) {
  try {
    const migration = loadMigration(filename);
    const completed = loadMigrationLog();
    
    if (completed.includes(filename)) {
      console.log(`ℹ️  Migration ${filename} is already marked as completed`);
      console.log('   If you want to run it again, remove it from .migrations_log.json');
      return;
    }
    
    displayMigration(migration);
    
    console.log('💡 Tip: After running the SQL in Supabase, mark it as completed:');
    console.log(`   npm run migrate -- --mark-completed ${filename}\n`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run all pending migrations
async function runAllPending() {
  const files = getMigrationFiles();
  const completed = loadMigrationLog();
  const pending = files.filter(f => !completed.includes(f));
  
  if (pending.length === 0) {
    console.log('✅ All migrations are completed!\n');
    return;
  }
  
  console.log(`\n📦 Found ${pending.length} pending migration(s)\n`);
  
  for (const file of pending) {
    await runMigration(file);
    console.log('\n');
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  // Handle npm script with -- separator
  const cleanArgs = args.filter(arg => arg !== '--');
  
  if (cleanArgs.length === 0 || cleanArgs[0] === '--all') {
    await runAllPending();
  } else if (cleanArgs[0] === '--list') {
    listMigrations();
  } else if (cleanArgs[0] === '--status') {
    checkStatus();
  } else if (cleanArgs[0] === '--mark-completed' && cleanArgs[1]) {
    markCompleted(cleanArgs[1]);
  } else if (cleanArgs[0].endsWith('.sql')) {
    await runMigration(cleanArgs[0]);
  } else {
    console.log('📖 Migration Manager\n');
    console.log('Usage:');
    console.log('  npm run migrate                    # Run all pending migrations');
    console.log('  npm run migrate:list               # List all migrations');
    console.log('  npm run migrate:status             # Check migration status');
    console.log('  npm run migrate -- <file.sql>      # Run specific migration');
    console.log('  npm run migrate -- --mark-completed <file.sql>  # Mark as completed\n');
  }
}

main();
