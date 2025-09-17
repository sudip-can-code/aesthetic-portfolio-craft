-- Add display_order column to projects table
ALTER TABLE projects ADD COLUMN display_order INTEGER DEFAULT 0;

-- Update existing projects with incremental display_order using a subquery
WITH ordered_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as new_order
  FROM projects
)
UPDATE projects 
SET display_order = ordered_projects.new_order
FROM ordered_projects 
WHERE projects.id = ordered_projects.id;