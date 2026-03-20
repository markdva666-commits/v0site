-- Remove all product images from the current catalog.
UPDATE products
SET images = ARRAY[]::text[];
