import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { Search, Filter, ChevronRight } from "lucide-react"
import type { Category } from "@/lib/types"

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; search?: string; manufacturer?: string }>
}

function getChildCategories(categories: Category[], parentId: string | null) {
  return categories.filter((category) => category.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
}

function getDescendantCategoryIds(categories: Category[], parentId: string) {
  const ids: string[] = []
  const stack = [parentId]

  while (stack.length > 0) {
    const currentId = stack.pop()!
    const children = categories.filter((category) => category.parent_id === currentId)

    for (const child of children) {
      ids.push(child.id)
      stack.push(child.id)
    }
  }

  return ids
}

function getCategoryTrail(categories: Category[], activeCategory: Category | undefined) {
  const trail: Category[] = []
  let current = activeCategory

  while (current) {
    trail.unshift(current)
    current = categories.find((category) => category.id === current?.parent_id)
  }

  return trail
}

async function getCatalogData(params: { category?: string; search?: string; manufacturer?: string }) {
  const supabase = await createClient()

  const [categoriesRes, manufacturersRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("manufacturers").select("*").order("name"),
  ])

  const categories = (categoriesRes.data || []) as Category[]
  const activeCategory = categories.find((category) => category.slug === params.category)
  const searchMode = Boolean(params.search || params.manufacturer)
  const shouldLoadProducts = searchMode || (activeCategory ? getChildCategories(categories, activeCategory.id).length === 0 : false)

  let products: Record<string, unknown>[] = []

  if (shouldLoadProducts) {
    let productsQuery = supabase
      .from("products")
      .select("*, category:categories(name, slug), manufacturer:manufacturers(name, slug)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (activeCategory) {
      const descendantIds = getDescendantCategoryIds(categories, activeCategory.id)
      productsQuery = productsQuery.in("category_id", [activeCategory.id, ...descendantIds])
    } else if (!searchMode) {
      productsQuery = productsQuery.limit(0)
    }

    if (params.manufacturer) {
      const mfr = manufacturersRes.data?.find((manufacturer) => manufacturer.slug === params.manufacturer)
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
    products = productsRes.data || []
  }

  return {
    categories,
    manufacturers: manufacturersRes.data || [],
    products,
    activeCategory,
    shouldLoadProducts,
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

function CategoryCard({
  category,
  childCount,
}: {
  category: Category
  childCount: number
}) {
  return (
    <Link href={`/catalog?category=${category.slug}`}>
      <Card className="group h-full overflow-hidden border-0 bg-transparent py-0 shadow-none gap-0">
        <CardContent className="p-0">
          <div className="relative aspect-[16/7] overflow-hidden rounded-xl bg-[#b10f14]">
            <img
              src={
                category.image_url ||
                `/placeholder.svg?height=420&width=960&query=${encodeURIComponent(category.name + " industrial equipment") || "/placeholder.svg"}`
              }
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-3xl lg:text-[2.1rem]">
                  {category.name}
                </h2>
                <p className="text-sm font-medium text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] sm:text-base">
                  {childCount > 0 ? `${childCount} подкатегорий` : "Перейти к товарам"}
                </p>
              </div>
            </div>
            <ChevronRight className="absolute bottom-5 right-5 h-6 w-6 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CategoryNavTree({
  categories,
  activeSlug,
  activeTrailIds,
  parentId,
  level = 0,
}: {
  categories: Category[]
  activeSlug?: string
  activeTrailIds: Set<string>
  parentId: string | null
  level?: number
}) {
  const branch = getChildCategories(categories, parentId)

  if (branch.length === 0) return null

  return (
    <div className="space-y-1">
      {branch.map((category) => {
        const isActive = activeSlug === category.slug
        const isExpanded = activeTrailIds.has(category.id)
        const descendants = getChildCategories(categories, category.id)

        return (
          <div key={category.id} className="space-y-1">
            <Link
              href={`/catalog?category=${category.slug}`}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-secondary text-secondary-foreground font-medium" : "hover:bg-muted"
              }`}
              style={{ marginLeft: `${level * 12}px` }}
            >
              {category.name}
            </Link>
            {isExpanded && descendants.length > 0 ? (
              <CategoryNavTree
                categories={categories}
                activeSlug={activeSlug}
                activeTrailIds={activeTrailIds}
                parentId={category.id}
                level={level + 1}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const { categories, manufacturers, products, activeCategory, shouldLoadProducts } = await getCatalogData(params)
  const topCategories = getChildCategories(categories, null)
  const visibleCategories = activeCategory ? getChildCategories(categories, activeCategory.id) : topCategories
  const categoryTrail = getCategoryTrail(categories, activeCategory)
  const activeTrailIds = new Set(categoryTrail.map((category) => category.id))
  const searchMode = Boolean(params.search || params.manufacturer)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Каталог</span>
        {categoryTrail.map((category) => (
          <span key={category.id} className="contents">
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </span>
        ))}
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
                <CategoryNavTree
                  categories={categories}
                  activeSlug={params.category}
                  activeTrailIds={activeTrailIds}
                  parentId={null}
                />
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
                {searchMode
                  ? `${products.length} ${products.length === 1 ? "результат" : products.length < 5 ? "результата" : "результатов"}`
                  : shouldLoadProducts
                    ? `${products.length} ${products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"}`
                    : `${visibleCategories.length} ${
                        visibleCategories.length === 1 ? "подкатегория" : visibleCategories.length < 5 ? "подкатегории" : "подкатегорий"
                      }`}
              </p>
            </div>
          </div>

          {!shouldLoadProducts && visibleCategories.length > 0 ? (
            <div className="grid gap-x-6 gap-y-6 xl:grid-cols-2">
              {visibleCategories.map((category) => (
                <CategoryCard key={category.id} category={category} childCount={getChildCategories(categories, category.id).length} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                {searchMode ? "По вашему запросу ничего не найдено" : "В этой категории пока нет подкатегорий или товаров"}
              </p>
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
