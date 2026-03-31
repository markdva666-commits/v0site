-- Seed base repair category and services for the dedicated repair section.
INSERT INTO categories (name, slug, description, sort_order, is_published)
VALUES ('Сервис и ремонт', 'servis-remont', 'Услуги по ремонту и обслуживанию техники', 100, true)
ON CONFLICT (slug) DO UPDATE
SET description = EXCLUDED.description,
    is_published = true;

INSERT INTO products (name, slug, sku, short_description, type, category_id, price_type, availability, specs, is_published)
VALUES
(
  'Ремонт гидроманипулятора',
  'remont-gidromanipulyatora',
  'SRV-GM-001',
  'Полный ремонт гидроманипулятора с заменой узлов и испытаниями',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 3 дней", "Что включено": "диагностика, ремонт, испытания", "Гарантия": "по договору"}'::jsonb,
  true
),
(
  'Ремонт гидравлики',
  'remont-gidravliki',
  'SRV-HYD-001',
  'Ремонт гидроцилиндров, насосов, распределителей и гидролиний',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 1 дня", "Что включено": "диагностика, дефектовка, ремонт", "Гарантия": "по договору"}'::jsonb,
  true
),
(
  'Диагностика спецтехники',
  'diagnostika-spectehniki',
  'SRV-DIAG-001',
  'Комплексная диагностика гидравлики и механики с заключением',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 2 часов", "Что включено": "осмотр, замеры, заключение", "Выезд": "возможен"}'::jsonb,
  true
),
(
  'Обслуживание гидравлики',
  'obsluzhivanie-gidravliki',
  'SRV-MAINT-001',
  'Регулярное техническое обслуживание гидравлических систем',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Периодичность": "по регламенту", "Что включено": "замена масла, фильтров, проверка давлений"}'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE
SET short_description = EXCLUDED.short_description,
    category_id = EXCLUDED.category_id,
    price_type = EXCLUDED.price_type,
    availability = EXCLUDED.availability,
    specs = EXCLUDED.specs,
    is_published = true;
