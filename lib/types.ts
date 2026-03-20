export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Manufacturer {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string | null
  description: string | null
  short_description: string | null
  type: "equipment" | "parts" | "service"
  category_id: string | null
  manufacturer_id: string | null
  price: number | null
  price_type: "fixed" | "request"
  availability: "in_stock" | "order"
  specs: Record<string, string> | null
  compatibility: string | null
  tags: string[] | null
  images: string[] | null
  is_popular: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  category?: Category
  manufacturer?: Manufacturer
}

export interface CompanySettings {
  id: string
  name: string
  inn: string | null
  description: string | null
  offer: string | null
  advantages: Record<string, unknown>[] | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  telegram: string | null
  address: string | null
  work_hours: string | null
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  task: string | null
  solution: string | null
  result: string | null
  images: string[] | null
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface Document {
  id: string
  title: string
  type: "certificate" | "requisites" | "other"
  file_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
}

export interface Lead {
  id: string
  name: string
  phone: string | null
  email: string | null
  company: string | null
  message: string | null
  topic: "quote" | "parts" | "repair" | "other"
  source_page: string | null
  product_id: string | null
  attachment_url: string | null
  status: "new" | "in_progress" | "done"
  manager_notes: string | null
  created_at: string
  updated_at: string
  product?: Product
}
