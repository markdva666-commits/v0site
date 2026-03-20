-- Seed initial company settings
INSERT INTO company_settings (name, inn, description, offer, advantages, phone, email, whatsapp, telegram, work_hours)
VALUES (
  'ООО «СпецТехСервис»',
  '6679048290',
  'Поставка оборудования и запасных частей для металлоперерабатывающего оборудования. Ремонт спецтехники и гидравлики.',
  'Поставка оборудования и запчастей + ремонт спецтехники и гидравлики',
  '[
    {"title": "Широкий ассортимент", "description": "Оригинальные и совместимые запчасти для всех типов металлоперерабатывающего оборудования"},
    {"title": "Оперативность", "description": "Быстрый подбор и доставка в любой регион России"},
    {"title": "Экспертиза", "description": "Техническая поддержка и консультации по подбору оборудования"},
    {"title": "Сервис", "description": "Собственная ремонтная база для диагностики и ремонта гидравлики"}
  ]'::jsonb,
  '+7 912 266-57-12',
  'speztehservis7@mail.ru',
  '+79122665712',
  'Agapitovvv',
  'Пн-Пт: 9:00–18:00'
) ON CONFLICT DO NOTHING;

-- Seed categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Ломовозы', 'lomovozi', 'Техника для погрузки и транспортировки металлолома', 1),
  ('Гидроманипуляторы', 'gidromanipulyatory', 'Гидравлические манипуляторы для спецтехники', 2),
  ('Перегружатели', 'peregruzhateli', 'Перегружатели для работы с металлоломом', 3),
  ('Пресс-ножницы', 'press-nozhnicy', 'Оборудование для резки и переработки металла', 4),
  ('Запчасти', 'zapchasti', 'Запасные части для спецтехники', 5),
  ('Гидравлика', 'gidravlika', 'Гидравлические узлы и компоненты', 6),
  ('Сервис и ремонт', 'servis-remont', 'Услуги по ремонту и обслуживанию техники', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed manufacturers
INSERT INTO manufacturers (name, slug, sort_order) VALUES
  ('Hiab', 'hiab', 1),
  ('Palfinger', 'palfinger', 2),
  ('Epsilon', 'epsilon', 3),
  ('Liebherr', 'liebherr', 4),
  ('Fuchs', 'fuchs', 5),
  ('Sennebogen', 'sennebogen', 6),
  ('Метсо', 'metso', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed products (equipment)
INSERT INTO products (name, slug, sku, short_description, type, category_id, manufacturer_id, price_type, availability, specs, compatibility, is_popular) VALUES
(
  'Ломовоз на базе КАМАЗ',
  'lomovoz-kamaz',
  'LV-KAMAZ-001',
  'Ломовоз с гидроманипулятором на базе КАМАЗ 65115',
  'equipment',
  (SELECT id FROM categories WHERE slug = 'lomovozi'),
  NULL,
  'request',
  'order',
  '{"Грузоподъёмность": "10 тонн", "База": "КАМАЗ 65115", "Вылет стрелы": "до 8 м", "Тип захвата": "грейфер"}'::jsonb,
  'КАМАЗ 65115, 6520',
  true
),
(
  'Гидроманипулятор HIAB XS 144',
  'hiab-xs-144',
  'HM-HIAB-144',
  'Кран-манипулятор HIAB серии XS для тяжёлых работ',
  'equipment',
  (SELECT id FROM categories WHERE slug = 'gidromanipulyatory'),
  (SELECT id FROM manufacturers WHERE slug = 'hiab'),
  'request',
  'order',
  '{"Грузоподъёмность": "14 т·м", "Вылет": "до 12.8 м", "Угол поворота": "400°", "Гидравлика": "Load Sensing"}'::jsonb,
  'Грузовые автомобили от 12 тонн',
  true
),
(
  'Перегружатель Fuchs MHL 350',
  'fuchs-mhl-350',
  'PG-FUCHS-350',
  'Универсальный перегружатель для работы с металлоломом',
  'equipment',
  (SELECT id FROM categories WHERE slug = 'peregruzhateli'),
  (SELECT id FROM manufacturers WHERE slug = 'fuchs'),
  'request',
  'order',
  '{"Масса": "35 тонн", "Мощность": "170 кВт", "Вылет": "до 16 м", "Объём грейфера": "0.6–1.2 м³"}'::jsonb,
  NULL,
  true
),
(
  'Пресс-ножницы стационарные ПН-500',
  'press-nozhnicy-pn-500',
  'PN-500',
  'Стационарные пресс-ножницы для резки металла',
  'equipment',
  (SELECT id FROM categories WHERE slug = 'press-nozhnicy'),
  NULL,
  'request',
  'order',
  '{"Усилие реза": "500 тс", "Длина реза": "до 800 мм", "Производительность": "до 10 т/ч", "Привод": "гидравлический"}'::jsonb,
  NULL,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- Seed products (parts)
INSERT INTO products (name, slug, sku, short_description, type, category_id, price_type, availability, specs, compatibility) VALUES
(
  'Гидроцилиндр подъёма стрелы',
  'gidrocilindr-podema',
  'HC-STRL-001',
  'Гидроцилиндр для подъёма стрелы манипулятора',
  'parts',
  (SELECT id FROM categories WHERE slug = 'gidravlika'),
  'request',
  'order',
  '{"Диаметр штока": "80 мм", "Диаметр цилиндра": "120 мм", "Ход": "1200 мм", "Давление": "до 320 бар"}'::jsonb,
  'HIAB XS 122, XS 144, XS 166'
),
(
  'Насос аксиально-поршневой',
  'nasos-aksialno-porshnevoj',
  'NP-AP-001',
  'Гидронасос аксиально-поршневой для манипуляторов',
  'parts',
  (SELECT id FROM categories WHERE slug = 'gidravlika'),
  'request',
  'in_stock',
  '{"Рабочий объём": "63 см³", "Давление": "до 350 бар", "Частота вращения": "до 3000 об/мин"}'::jsonb,
  'Palfinger, HIAB, Epsilon'
),
(
  'Ремкомплект гидроцилиндра',
  'remkomplekt-gidrocilindra',
  'RK-HC-80',
  'Полный ремкомплект уплотнений для гидроцилиндра d80',
  'parts',
  (SELECT id FROM categories WHERE slug = 'zapchasti'),
  'fixed',
  'in_stock',
  '{"Диаметр": "80 мм", "Комплектация": "манжеты, кольца, пыльник"}'::jsonb,
  'Универсальный'
),
(
  'Грейфер для металлолома',
  'grejfer-metallolom',
  'GR-ML-500',
  'Грейфер полипного типа для металлолома',
  'parts',
  (SELECT id FROM categories WHERE slug = 'zapchasti'),
  'request',
  'order',
  '{"Объём": "0.5 м³", "Масса": "450 кг", "Тип": "полип 5 лепестков"}'::jsonb,
  'Манипуляторы от 10 т·м'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed products (services)
INSERT INTO products (name, slug, sku, short_description, type, category_id, price_type, availability, specs) VALUES
(
  'Ремонт гидроманипулятора',
  'remont-gidromanipulyatora',
  'SRV-GM-001',
  'Полный ремонт гидроманипулятора с заменой узлов',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 3 дней", "Что включено": "диагностика, ремонт, испытания", "Гарантия": "по договору"}'::jsonb
),
(
  'Ремонт гидравлики',
  'remont-gidravliki',
  'SRV-HYD-001',
  'Ремонт гидроцилиндров, насосов, распределителей',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 1 дня", "Что включено": "диагностика, дефектовка, ремонт", "Гарантия": "по договору"}'::jsonb
),
(
  'Диагностика спецтехники',
  'diagnostika-spectehniki',
  'SRV-DIAG-001',
  'Комплексная диагностика гидравлики и механики',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Сроки": "от 2 часов", "Что включено": "осмотр, замеры, заключение", "Выезд": "возможен"}'::jsonb
),
(
  'Обслуживание гидравлики',
  'obsluzhivanie-gidravliki',
  'SRV-MAINT-001',
  'Регулярное ТО гидравлических систем',
  'service',
  (SELECT id FROM categories WHERE slug = 'servis-remont'),
  'request',
  'in_stock',
  '{"Периодичность": "по регламенту", "Что включено": "замена масла, фильтров, проверка давлений"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Seed case studies
INSERT INTO case_studies (title, slug, task, solution, result, sort_order) VALUES
(
  'Восстановление гидроманипулятора HIAB',
  'vosstanovlenie-hiab',
  'Клиент обратился с неисправным манипулятором HIAB XS 144: потеря мощности, течи гидравлики.',
  'Провели полную диагностику, выявили износ уплотнений цилиндров и насоса. Выполнили капитальный ремонт с заменой изношенных элементов.',
  'Манипулятор восстановлен до рабочего состояния, клиент продолжает эксплуатацию.',
  1
),
(
  'Поставка запчастей для перегружателя',
  'postavka-zapchastej-peregruzchatel',
  'Срочная потребность в комплекте уплотнений и гидрораспределителе для Fuchs MHL.',
  'Подобрали совместимые запчасти, организовали доставку в течение 5 дней.',
  'Клиент оперативно восстановил работу перегружателя, минимизировав простой.',
  2
)
ON CONFLICT (slug) DO NOTHING;
