-- СпецТехСервис Database Schema
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Manufacturers table
CREATE TABLE IF NOT EXISTS manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table (equipment, parts, services)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  description TEXT,
  short_description TEXT,
  type TEXT NOT NULL CHECK (type IN ('equipment', 'parts', 'service')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE SET NULL,
  price DECIMAL(12,2),
  price_type TEXT DEFAULT 'request' CHECK (price_type IN ('fixed', 'request')),
  availability TEXT DEFAULT 'order' CHECK (availability IN ('in_stock', 'order')),
  specs JSONB DEFAULT '{}',
  compatibility TEXT,
  tags TEXT[],
  images TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Company settings (singleton pattern)
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'ООО «СпецТехСервис»',
  inn TEXT DEFAULT '6679048290',
  description TEXT,
  offer TEXT,
  advantages JSONB DEFAULT '[]',
  phone TEXT DEFAULT '+7 912 266-57-12',
  email TEXT DEFAULT 'speztehservis7@mail.ru',
  whatsapp TEXT DEFAULT '+79122665712',
  telegram TEXT DEFAULT 'Agapitovvv',
  address TEXT,
  work_hours TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Case studies
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  task TEXT,
  solution TEXT,
  result TEXT,
  images TEXT[],
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents (certificates, requisites, etc.)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'certificate' CHECK (type IN ('certificate', 'requisites', 'other')),
  file_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads / inquiries
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  message TEXT,
  topic TEXT DEFAULT 'quote' CHECK (topic IN ('quote', 'parts', 'repair', 'other')),
  source_page TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  attachment_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  manager_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public can read published categories" ON categories FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read manufacturers" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Public can read published products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read company settings" ON company_settings FOR SELECT USING (true);
CREATE POLICY "Public can read published case studies" ON case_studies FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published documents" ON documents FOR SELECT USING (is_published = true);

-- Public can insert leads
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) full access
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access manufacturers" ON manufacturers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access company_settings" ON company_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access case_studies" ON case_studies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access documents" ON documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
