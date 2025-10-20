/*
  # Complete Database Schema for 3D Time Optimizer

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `life_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `current_age` (integer)
      - `target_age` (integer)
      - `activities` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `time_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `year` (integer)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add update triggers for timestamps

  3. Functions
    - `update_updated_at_column()` function for automatic timestamp updates
*/

-- Create update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own profile"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
    ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create life_data table
CREATE TABLE IF NOT EXISTS life_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    current_age integer NOT NULL DEFAULT 0,
    target_age integer NOT NULL DEFAULT 80,
    activities jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE life_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own life data"
    ON life_data
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own life data"
    ON life_data
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own life data"
    ON life_data
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own life data"
    ON life_data
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create trigger for life_data
DROP TRIGGER IF EXISTS update_life_data_updated_at ON life_data;
CREATE TRIGGER update_life_data_updated_at
    BEFORE UPDATE ON life_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create time_data table
CREATE TABLE IF NOT EXISTS time_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    year integer NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, year)
);

ALTER TABLE time_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own time data"
    ON time_data
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own time data"
    ON time_data
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own time data"
    ON time_data
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own time data"
    ON time_data
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create trigger for time_data
DROP TRIGGER IF EXISTS update_time_data_updated_at ON time_data;
CREATE TRIGGER update_time_data_updated_at
    BEFORE UPDATE ON time_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    content text NOT NULL DEFAULT ''::text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own notes"
    ON notes
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own notes"
    ON notes
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notes"
    ON notes
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notes"
    ON notes
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create trigger for notes
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_life_data_user_id ON life_data(user_id);
CREATE INDEX IF NOT EXISTS idx_time_data_user_id ON time_data(user_id);
CREATE INDEX IF NOT EXISTS idx_time_data_year ON time_data(year);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);