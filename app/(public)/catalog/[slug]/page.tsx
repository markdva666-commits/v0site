import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { LeadForm } from "@/components/lead-form"
import { ChevronRight, Phone, FileText, Truck, Shield, Check } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug), manufacturer:manufacturers(id, name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!product) return null

  // Get related products from same category
  const { data: related } = await supabase
    .from("products")
    .select("id, name, slug, images, price")
    .eq("category_id", (product.category as { id: string })?.id)
    .neq("id", product.id)
    .eq("is_published", true)
    .limit(4)

  return { product, related: related || [] }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const data = await getProduct(slug)

  if (!data) {
    notFound()
  }

  const { product, related } = data
  const category = product.category as { name: string; slug: string } | null
  const manufacturer = product.manufacturer as { name: string } | null
  const images = (product.images as string[]) || []
  const specs = (product.specs as Record<string, string>) || {}
  const isInStock = product.availability === "in_stock"

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog" className="hover:text-foreground">
          Каталог
        </Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/catalog?category=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-xl bg-muted overflow-hidden mb-4">
            <img
              src={
                images[0] ||
                `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name + " industrial equipment") || "/placeholder.svg"}`
              }
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                  <img src={img || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            {manufacturer && <Badge variant="outline">{manufacturer.name}</Badge>}
            {isInStock && <Badge className="bg-green-100 text-green-800">В наличии</Badge>}
            {!isInStock && <Badge variant="outline">Под заказ</Badge>}
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.sku && <p className="text-sm text-muted-foreground mb-4">Артикул: {product.sku}</p>}

          {product.short_description && <p className="text-muted-foreground mb-6">{product.short_description}</p>}

          <div className="p-6 rounded-xl bg-muted/50 mb-6">
            {product.price && product.price_type === "fixed" ? (
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat("ru-RU").format(product.price)} ₽
                </span>
              </div>
            ) : (
              <p className="text-lg mb-4">Цена по запросу</p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href="#order">Запросить КП</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+78001234567">
                  <Phone className="mr-2 h-4 w-4" />
                  Позвонить
                </a>
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Доставка по РФ</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Гарантия 24 мес</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-5 w-5 text-primary" />
              <span>Документация</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-5 w-5 text-primary" />
              <span>Сертификаты</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Описание
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Характеристики
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Документы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          {product.description ? (
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Описание скоро появится</p>
          )}
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          {Object.keys(specs).length > 0 ? (
            <div className="grid gap-2 max-w-2xl">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Характеристики уточняйте у менеджера</p>
          )}
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <p className="text-muted-foreground">
            Техническая документация предоставляется по запросу.
            <Link href="/contacts" className="text-primary hover:underline ml-1">
              Свяжитесь с нами
            </Link>
          </p>
        </TabsContent>
      </Tabs>

      {/* Order Form */}
      <section id="order" className="mt-16 scroll-mt-24">
        <Card>
          <CardHeader>
            <CardTitle>Запросить коммерческое предложение</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm productId={product.id} productName={product.name} type="quote" />
          </CardContent>
        </Card>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} href={`/catalog/${item.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
                      <img
                        src={
                          (item.images as string[])?.[0] ||
                          `/placeholder.svg?height=150&width=200&query=${encodeURIComponent(item.name) || "/placeholder.svg"}`
                        }
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h3>
                    {item.price && (
                      <p className="mt-2 font-bold text-primary">
                        {new Intl.NumberFormat("ru-RU").format(item.price)} ₽
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
