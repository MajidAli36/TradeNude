# Migration System - Complete Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install -D tsx
```

### 2. Run Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# List all migrations
npm run migrate:list
```

## Commands

### Run All Pending Migrations
```bash
npm run migrate
```
This will:
- Find all pending migrations
- Display SQL for each one
- Show instructions to run in Supabase

### Check Status
```bash
npm run migrate:status
```
Shows:
- Total migrations
- Completed count
- Pending count
- List of pending migrations

### List All Migrations
```bash
npm run migrate:list
```
Shows all migrations with their completion status.

### Run Specific Migration
```bash
npm run migrate -- migrations/001_add_title_column.sql
```

### Mark Migration as Completed
After running SQL in Supabase, mark it as completed:
```bash
npm run migrate -- --mark-completed migrations/001_add_title_column.sql
```

## Workflow

### Step 1: Create Migration
1. Create a new SQL file in `migrations/` folder
2. Name it: `002_your_migration_name.sql`
3. Write your SQL

### Step 2: Run Migration
```bash
npm run migrate
```

### Step 3: Execute SQL
1. Copy the SQL shown
2. Go to Supabase Dashboard → SQL Editor
3. Paste and run

### Step 4: Mark as Completed
```bash
npm run migrate -- --mark-completed migrations/002_your_migration_name.sql
```

## Example

```bash
# 1. Check what needs to be run
npm run migrate:status

# Output:
# 📊 Migration Status:
#    Total migrations: 1
#    Completed: 0
#    Pending: 1
#    Pending migrations:
#      - 001_add_title_column.sql

# 2. Run the migration
npm run migrate

# 3. Copy SQL and run in Supabase

# 4. Mark as completed
npm run migrate -- --mark-completed migrations/001_add_title_column.sql

# 5. Verify
npm run migrate:status
# Output: All migrations completed! ✅
```

## Migration File Format

Create files in `migrations/` folder:

```
migrations/
  ├── 001_add_title_column.sql
  ├── 002_add_index.sql
  └── 003_update_schema.sql
```

## Tips

1. **Always backup** before running migrations
2. **Test on dev** database first
3. **Use transactions** in your SQL when possible
4. **Check status** before and after migrations
5. **Mark completed** after successful execution

## Troubleshooting

### Migration already marked as completed
If you need to re-run a migration:
1. Edit `.migrations_log.json`
2. Remove the migration filename
3. Run migration again

### Migration file not found
- Check file is in `migrations/` folder
- Check filename ends with `.sql`
- Check file name matches exactly

### SQL execution fails
- Check SQL syntax
- Verify you have proper permissions in Supabase
- Check Supabase logs for detailed error

## Current Migrations

### 001_add_title_column.sql
- **Purpose**: Adds `title` column to profiles table
- **Status**: Check with `npm run migrate:status`
- **Safe**: Yes (checks if column exists first)
