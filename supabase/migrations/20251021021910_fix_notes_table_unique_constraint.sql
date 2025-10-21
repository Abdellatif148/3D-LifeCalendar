/*
  # Fix Notes Table Schema
  
  ## Changes
  - Remove UNIQUE constraint on user_id column in notes table
  - This allows users to have multiple notes instead of just one
  
  ## Reason
  The current schema has a UNIQUE constraint on user_id which limits each user to a single note.
  This migration removes that constraint to allow multiple notes per user.
*/

-- Drop the unique constraint on user_id in notes table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'notes_user_id_key' 
    AND conrelid = 'notes'::regclass
  ) THEN
    ALTER TABLE notes DROP CONSTRAINT notes_user_id_key;
  END IF;
END $$;