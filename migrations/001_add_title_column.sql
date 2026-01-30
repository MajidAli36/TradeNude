-- Migration: Add title column to profiles table
-- Date: 2026-01-30
-- Description: Add optional title column for profile titles used in URL generation

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
        
        -- Add comment to column
        COMMENT ON COLUMN profiles.title IS 'Profile title used for URL slug generation';
    END IF;
END $$;
