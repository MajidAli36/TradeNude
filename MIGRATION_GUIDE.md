# Database Migration Guide

This guide shows you how to run database migrations without going to Supabase dashboard.

## Option 1: Run SQL Migration Manually (Easiest)

1. **Open the migration file:**
   ```
   migrations/001_add_title_column.sql
   ```

2. **Copy the SQL content**

3. **Go to Supabase Dashboard:**
   - Open https://supabase.com/dashboard
   - Select your project
   - Go to **SQL Editor** → **New Query**

4. **Paste and run the SQL**

## Option 2: Use Migration Script (Recommended)

### Setup

1. **Install tsx** (if not already installed):
   ```bash
   npm install -D tsx
   ```

2. **Run migration:**
   ```bash
   npm run migrate migrations/001_add_title_column.sql
   ```

   This will output the SQL for you to copy and run.

## Option 3: Use Admin API Endpoint

1. **Make a POST request to the migration endpoint:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/migrate \
     -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"migrationFile": "migrations/001_add_title_column.sql"}'
   ```

2. **Copy the SQL from the response and run it in Supabase SQL Editor**

## Current Migration

### Migration 001: Add Title Column

**File:** `migrations/001_add_title_column.sql`

**What it does:**
- Adds a `title` column to the `profiles` table
- Makes it optional (nullable)
- Adds a comment explaining its purpose

**SQL:**
```sql
-- Add title column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'title'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN title TEXT;
        
        COMMENT ON COLUMN profiles.title IS 'Profile title used for URL slug generation';
    END IF;
END $$;
```

## Creating New Migrations

1. **Create a new SQL file:**
   ```
   migrations/002_your_migration_name.sql
   ```

2. **Write your SQL:**
   ```sql
   -- Your migration SQL here
   ```

3. **Run it using one of the methods above**

## Important Notes

⚠️ **Security:**
- Always backup your database before running migrations
- Test migrations on a development database first
- The admin API endpoint requires admin secret authentication

⚠️ **Supabase Limitations:**
- Supabase JS client doesn't support raw SQL execution
- You need to use Supabase SQL Editor or REST API
- The migration scripts prepare SQL for you to run

## Quick Start

**Fastest way to run the current migration:**

1. Open `migrations/001_add_title_column.sql`
2. Copy all SQL
3. Go to Supabase Dashboard → SQL Editor
4. Paste and click "Run"

That's it! ✅
