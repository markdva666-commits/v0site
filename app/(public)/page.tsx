import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Truck, Cog, Wrench, Shield, Clock, Award, ChevronRight, Phone } from "lucide-react"

async function getHomeData() {
  const supabase = await createClient()

  const [categoriesRes, productsRes, casesRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_published", true).order("sort_order"),
    supabase
      .from("products")
      .select("*, category:categories(name, slug)")
      .eq("is_published", true)
      .eq("is_popular", true)
      .limit(4),
    supabase.from("case_studies").select("*").eq("is_published", true).limit(3),
  ])

  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || [],
    cases: casesRes.data || [],
  }
}

export default async function HomePage() {
  const { categories, products, cases } = await getHomeData()

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-muted">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Надёжный партнёр с 2010 года
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Оборудование для
                <span className="text-primary"> переработки металла</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Поставляем спецтехнику, запчасти и комплектующие для предприятий металлопереработки. Сервис и
                техподдержка по всей России.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/catalog">
                    Каталог оборудования
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contacts#form">Запросить КП</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Гарантия 24 мес
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Доставка по РФ
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                <img
                  src="/terex-fuchs-340.jpeg"
                  alt="Terex Fuchs 340"
                  className="h-full w-full rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Категории оборудования</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Широкий ассортимент техники для всех этапов переработки металлолома
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/catalog?category=${category.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="h-40 rounded-lg bg-gradient-to-br from-secondary to-muted mb-4 overflow-hidden">
                      <img
                        src={
                          category.image_url ||
                          `/placeholder.svg?height=160&width=300&query=${encodeURIComponent(category.name + " industrial equipment") || "/placeholder.svg"}`
                        }
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardTitle>
                  </CardHeader>
                  {category.description && (
                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Популярное оборудование</h2>
              <p className="mt-3 text-muted-foreground">Лучшие предложения этого месяца</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/catalog">
                Весь каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/catalog/${product.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="aspect-[4/3] rounded-lg bg-muted mb-4 overflow-hidden">
                      <img
                        src={
                          product.images?.[0] ||
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name + " industrial equipment") || "/placeholder.svg"}`
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {(product.category as { name: string })?.name || "Оборудование"}
                    </Badge>
                    <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      {product.price ? (
                        <span className="text-lg font-bold text-primary">
                          {new Intl.NumberFormat("ru-RU").format(product.price)} ₽
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Цена по запросу</span>
                      )}
                      <Button size="sm" variant="ghost" className="text-accent hover:text-accent/80">
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Наши услуги</h2>
            <p className="mt-3 opacity-80 max-w-2xl mx-auto">
              Полный цикл поддержки: от подбора оборудования до сервисного обслуживания
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <Cog className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Поставка запчастей</h3>
              <p className="opacity-80">
                Оригинальные и совместимые запчасти для всех типов оборудования. Подбор по артикулу или описанию.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Сервис и ремонт</h3>
              <p className="opacity-80">
                Техническое обслуживание и ремонт оборудования. Выезд специалистов по всей России.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Техподдержка 24/7</h3>
              <p className="opacity-80">
                Консультации по эксплуатации и устранению неисправностей. Быстрая помощь в экстренных ситуациях.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">
                Все услуги
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      {cases.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Наши кейсы</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Примеры успешного сотрудничества с клиентами
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {cases.map((caseStudy) => (
                <Card key={caseStudy.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={
                        caseStudy.image_url ||
                        `/placeholder.svg?height=200&width=400&query=industrial factory metal processing` ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={caseStudy.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{caseStudy.title}</CardTitle>
                    {caseStudy.client_name && <CardDescription>{caseStudy.client_name}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{caseStudy.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Почему выбирают нас</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="font-semibold mb-2">15+ лет опыта</h3>
              <p className="text-sm text-muted-foreground">Работаем с 2010 года, знаем отрасль изнутри</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="font-semibold mb-2">Доставка по РФ</h3>
              <p className="text-sm text-muted-foreground">Отправляем оборудование в любой регион страны</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="font-semibold mb-2">Гарантия 24 мес</h3>
              <p className="text-sm text-muted-foreground">Официальная гарантия на всё оборудование</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cog className="h-7 w-7" />
              </div>
              <h3 className="font-semibold mb-2">Запчасти в наличии</h3>
              <p className="text-sm text-muted-foreground">Склад запчастей для быстрой отгрузки</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent/10 via-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Оставьте заявку или позвоните — поможем подобрать оборудование под ваши задачи
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/contacts#form">Оставить заявку</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:+78001234567">
                <Phone className="mr-2 h-4 w-4" />8 (800) 123-45-67
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
