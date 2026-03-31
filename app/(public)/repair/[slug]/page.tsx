import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { LeadForm } from "@/components/lead-form"
import { ChevronRight, Phone, FileText, Shield, Check, Wrench } from "lucide-react"

interface RepairServicePageProps {
  params: Promise<{ slug: string }>
}

async function getRepairService(slug: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("slug", slug)
    .eq("type", "service")
    .eq("is_published", true)
    .single()

  if (!product) return null

  const { data: related } = await supabase
    .from("products")
    .select("id, name, slug, images, short_description")
    .eq("type", "service")
    .eq("category_id", (product.category as { id: string })?.id)
    .neq("id", product.id)
    .eq("is_published", true)
    .limit(4)

  return { product, related: related || [] }
}

export default async function RepairServicePage({ params }: RepairServicePageProps) {
  const { slug } = await params
  const data = await getRepairService(slug)

  if (!data) {
    notFound()
  }

  const { product, related } = data
  const category = product.category as { name: string; slug: string } | null
  const images = (product.images as string[]) || []
  const specs = (product.specs as Record<string, string>) || {}

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/repair" className="hover:text-foreground">
          Ремонт
        </Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/repair?category=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square rounded-xl bg-muted overflow-hidden mb-4">
            <img
              src={
                images[0] ||
                `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name + " repair service") || "/placeholder.svg"}`
              }
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            <Badge variant="outline">Ремонт</Badge>
            <Badge className="bg-green-100 text-green-800">Принимаем в работу</Badge>
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.sku && <p className="text-sm text-muted-foreground mb-4">Артикул услуги: {product.sku}</p>}

          {product.short_description && <p className="text-muted-foreground mb-6">{product.short_description}</p>}

          <div className="p-6 rounded-xl bg-muted/50 mb-6">
            <p className="text-lg mb-4">Стоимость рассчитывается после диагностики</p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href="#order">Оставить заявку</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+78001234567">
                  <Phone className="mr-2 h-4 w-4" />
                  Позвонить
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Wrench className="h-5 w-5 text-primary" />
              <span>Ремонт любой сложности</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Гарантия на работы</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-5 w-5 text-primary" />
              <span>Дефектовка и заключение</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-5 w-5 text-primary" />
              <span>Испытания после ремонта</span>
            </div>
          </div>
        </div>
      </div>

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
            Что входит
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
            <p className="text-muted-foreground">Описание услуги скоро появится</p>
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
            <p className="text-muted-foreground">Состав работ уточняется после диагностики</p>
          )}
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <p className="text-muted-foreground">
            Акт дефектовки, перечень работ и условия гарантии предоставляются по запросу.
            <Link href="/contacts" className="text-primary hover:underline ml-1">
              Свяжитесь с нами
            </Link>
          </p>
        </TabsContent>
      </Tabs>

      <section id="order" className="mt-16 scroll-mt-24">
        <Card>
          <CardHeader>
            <CardTitle>Оставить заявку на ремонт</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm productId={product.id} productName={product.name} type="repair" />
          </CardContent>
        </Card>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Похожие услуги</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} href={`/repair/${item.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
                      <img
                        src={
                          (item.images as string[])?.[0] ||
                          `/placeholder.svg?height=150&width=200&query=${encodeURIComponent(item.name + " repair service") || "/placeholder.svg"}`
                        }
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h3>
                    {item.short_description && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.short_description}</p>}
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
