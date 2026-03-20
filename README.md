# SiteV0

## Database workflow

- Источник правды для Supabase миграций: `supabase/migrations/*`.
- Файлы в `scripts/001-create-schema.sql`, `scripts/002-seed-data.sql` и `scripts/003-add-category-parent.sql` сохранены как удобные standalone SQL-скрипты, но изменения для продовой базы нужно оформлять новой миграцией в `supabase/migrations`.
- Любые изменения структуры каталога, категорий, подкатегорий, товаров и сидов каталога добавляются новой SQL-миграцией. Не редактировать задним числом уже применённые миграции.
- Для заливки в связанный Supabase-проект использовать `supabase db push`.
