-- Add display_order column to projects table
ALTER TABLE projects ADD COLUMN display_order INTEGER DEFAULT 0;

-- Update existing projects with incremental display_order
UPDATE projects 
SET display_order = row_number() OVER (ORDER BY created_at DESC);