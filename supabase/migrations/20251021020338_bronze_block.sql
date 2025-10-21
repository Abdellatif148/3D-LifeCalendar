/*
  # Complete Database Schema for 3D Time Optimizer

  This migration creates the complete database schema with proper relationships,
  security policies, and optimized structure for the 3D Time Optimizer application.

  ## New Tables
  - `user_profiles`: User account information and preferences
  - `life_data`: Core life metrics and daily activity allocations
  - `time_data`: Detailed scheduling and goal data organized by year
  - `notes`: Personal notes and thoughts with full-text search

  ## Security
  - Enable RLS on all tables
  - Add comprehensive policies for authenticated users
  - Ensure users can only access their own data

  ## Performance
  - Add appropriate indexes for common queries
  - Enable full-text search on notes
  - Optimize for mobile and web access patterns

  ## Functions
  - Auto-update timestamps
  - Search functionality
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Life Data Table
CREATE TABLE IF NOT EXISTS life_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    current_age integer NOT NULL DEFAULT 0,
    target_age integer NOT NULL DEFAULT 80,
    activities jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT valid_ages CHECK (current_age >= 0 AND target_age > current_age AND target_age <= 120),
    CONSTRAINT valid_activities CHECK (jsonb_typeof(activities) = 'array')
);

-- Enable RLS
ALTER TABLE life_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for life_data
CREATE POLICY "Users can view own life data"
    ON life_data FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own life data"
    ON life_data FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own life data"
    ON life_data FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own life data"
    ON life_data FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Trigger for life_data
CREATE TRIGGER update_life_data_updated_at
    BEFORE UPDATE ON life_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Time Data Table
CREATE TABLE IF NOT EXISTS time_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    year integer NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(user_id, year),
    CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2200),
    CONSTRAINT valid_data CHECK (jsonb_typeof(data) = 'object')
);

-- Enable RLS
ALTER TABLE time_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for time_data
CREATE POLICY "Users can view own time data"
    ON time_data FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own time data"
    ON time_data FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own time data"
    ON time_data FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own time data"
    ON time_data FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Trigger for time_data
CREATE TRIGGER update_time_data_updated_at
    BEFORE UPDATE ON time_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    content text NOT NULL DEFAULT ''::text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Users can view own notes"
    ON notes FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notes"
    ON notes FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notes"
    ON notes FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notes"
    ON notes FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Trigger for notes
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_life_data_user_id ON life_data(user_id);
CREATE INDEX IF NOT EXISTS idx_time_data_user_id ON time_data(user_id);
CREATE INDEX IF NOT EXISTS idx_time_data_year ON time_data(year);
CREATE INDEX IF NOT EXISTS idx_time_data_user_year ON time_data(user_id, year);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Full-text search index for notes
CREATE INDEX IF NOT EXISTS idx_notes_content_fts ON notes USING gin(to_tsvector('english', content));

-- GIN index for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_life_data_activities ON life_data USING gin(activities);
CREATE INDEX IF NOT EXISTS idx_time_data_data ON time_data USING gin(data);

-- Function to search notes
CREATE OR REPLACE FUNCTION search_notes(user_uuid uuid, search_query text)
RETURNS TABLE(
    id uuid,
    content text,
    created_at timestamptz,
    updated_at timestamptz,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.content,
        n.created_at,
        n.updated_at,
        ts_rank(to_tsvector('english', n.content), plainto_tsquery('english', search_query)) as rank
    FROM notes n
    WHERE n.user_id = user_uuid
    AND to_tsvector('english', n.content) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, n.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION search_notes TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column TO authenticated;