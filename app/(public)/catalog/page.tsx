import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { Search, Filter, ChevronRight } from "lucide-react"

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; search?: string; manufacturer?: string }>
}

async function getCatalogData(params: { category?: string; search?: string; manufacturer?: string }) {
  const supabase = await createClient()

  const [categoriesRes, manufacturersRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("manufacturers").select("*").order("name"),
  ])

  let productsQuery = supabase
    .from("products")
    .select("*, category:categories(name, slug), manufacturer:manufacturers(name, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (params.category) {
    const cat = categoriesRes.data?.find((c) => c.slug === params.category)
    if (cat) {
      productsQuery = productsQuery.eq("category_id", cat.id)
    }
  }

  if (params.manufacturer) {
    const mfr = manufacturersRes.data?.find((m) => m.slug === params.manufacturer)
    if (mfr) {
      productsQuery = productsQuery.eq("manufacturer_id", mfr.id)
    }
  }

  if (params.search) {
    productsQuery = productsQuery.or(
      `name.ilike.%${params.search}%,sku.ilike.%${params.search}%,description.ilike.%${params.search}%`,
    )
  }

  const productsRes = await productsQuery

  return {
    categories: categoriesRes.data || [],
    manufacturers: manufacturersRes.data || [],
    products: productsRes.data || [],
  }
}

function ProductCard({ product }: { product: Record<string, unknown> }) {
  const category = product.category as { name: string; slug: string } | null
  const manufacturer = product.manufacturer as { name: string } | null
  const images = product.images as string[] | null

  return (
    <Link href={`/catalog/${product.slug}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="aspect-[4/3] rounded-lg bg-muted mb-4 overflow-hidden">
            <img
              src={
                images?.[0] ||
                `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(String(product.name) + " industrial equipment") || "/placeholder.svg"}`
              }
              alt={String(product.name)}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            {manufacturer && <Badge variant="outline">{manufacturer.name}</Badge>}
          </div>
          <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
            {String(product.name)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {product.sku && <p className="text-xs text-muted-foreground mb-2">Артикул: {String(product.sku)}</p>}
          <div className="flex items-center justify-between">
            {product.price ? (
              <span className="text-lg font-bold text-primary">
                {new Intl.NumberFormat("ru-RU").format(Number(product.price))} ₽
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Цена по запросу</span>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const { categories, manufacturers, products } = await getCatalogData(params)
  const activeCategory = categories.find((c) => c.slug === params.category)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Каталог</span>
        {activeCategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{activeCategory.name}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <form className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="search" placeholder="Поиск по каталогу..." defaultValue={params.search} className="pl-10" />
            </form>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Категории
              </h3>
              <div className="space-y-1">
                <Link
                  href="/catalog"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !params.category ? "bg-secondary text-secondary-foreground font-medium" : "hover:bg-muted"
                  }`}
                >
                  Все категории
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      params.category === cat.slug
                        ? "bg-secondary text-secondary-foreground font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Manufacturers */}
            {manufacturers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Производители</h3>
                <div className="space-y-1">
                  {manufacturers.map((mfr) => (
                    <Link
                      key={mfr.id}
                      href={`/catalog?manufacturer=${mfr.slug}${params.category ? `&category=${params.category}` : ""}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        params.manufacturer === mfr.slug
                          ? "bg-secondary text-secondary-foreground font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      {mfr.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-4">
                <p className="text-sm mb-3">Не нашли нужное оборудование?</p>
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link href="/contacts#form">Отправить запрос</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{activeCategory?.name || "Каталог оборудования"}</h1>
              <p className="text-muted-foreground mt-1">
                {products.length} {products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">По вашему запросу ничего не найдено</p>
              <Button asChild variant="outline">
                <Link href="/catalog">Сбросить фильтры</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CatalogContent {...props} />
    </Suspense>
  )
}
