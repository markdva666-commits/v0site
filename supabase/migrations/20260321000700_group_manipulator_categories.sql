-- Group imported manipulator catalogs under a shared parent category.
WITH parent_category AS (
  INSERT INTO categories (name, slug, description, sort_order, parent_id, is_published)
  VALUES (
    'Гидроманипуляторы',
    'gidromanipulyatory',
    'Каталог запчастей и комплектующих для гидроманипуляторов.',
    1,
    NULL,
    true
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    parent_id = EXCLUDED.parent_id,
    is_published = EXCLUDED.is_published
  RETURNING id
)
UPDATE categories
SET
  parent_id = (SELECT id FROM parent_category),
  sort_order = CASE slug
    WHEN 'pl-70-omtl-97' THEN 1
    WHEN 'vm10l74-vm10lm' THEN 2
    ELSE sort_order
  END
WHERE slug IN ('pl-70-omtl-97', 'vm10l74-vm10lm');
