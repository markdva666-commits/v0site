-- Legacy migration for databases that were created before nested categories support.
-- On a fresh database the column already exists in the initial schema, so this is a no-op.
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
