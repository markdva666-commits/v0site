-- Add additional root-level catalog categories alongside "Гидроманипуляторы".
INSERT INTO categories (name, slug, description, sort_order, parent_id, is_published)
VALUES
  (
    'Перегружатели',
    'peregruzhateli',
    'Каталог перегружателей и комплектующих.',
    2,
    NULL,
    true
  ),
  (
    'Навесное оборудование',
    'navesnoe-oborudovanie',
    'Каталог навесного оборудования и комплектующих.',
    3,
    NULL,
    true
  ),
  (
    'Гидронасосы | Гидромоторы',
    'gidronasosy-gidromotory',
    'Каталог гидронасосов, гидромоторов и связанных комплектующих.',
    4,
    NULL,
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  parent_id = EXCLUDED.parent_id,
  is_published = EXCLUDED.is_published;
