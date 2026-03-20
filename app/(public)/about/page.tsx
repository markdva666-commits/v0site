import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ChevronRight, Award, Users, MapPin, Calendar, FileText, ArrowRight } from "lucide-react"

async function getAboutData() {
  const supabase = await createClient()

  const [casesRes, docsRes] = await Promise.all([
    supabase.from("case_studies").select("*").eq("is_published", true).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("is_public", true).order("sort_order"),
  ])

  return {
    cases: casesRes.data || [],
    documents: docsRes.data || [],
  }
}

const stats = [
  { value: "15+", label: "лет на рынке" },
  { value: "500+", label: "единиц техники поставлено" },
  { value: "200+", label: "клиентов по всей России" },
  { value: "24/7", label: "техническая поддержка" },
]

const timeline = [
  { year: "2010", title: "Основание компании", description: "Начало деятельности по поставке спецтехники" },
  { year: "2014", title: "Открытие сервисного центра", description: "Запуск собственного сервиса в Москве" },
  { year: "2018", title: "Расширение географии", description: "Начало работы с клиентами по всей России" },
  { year: "2022", title: "Новое направление", description: "Запуск продаж запчастей и комплектующих" },
]

export default async function AboutPage() {
  const { cases, documents } = await getAboutData()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">О компании</span>
      </nav>

      {/* Hero */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold mb-6">О компании СпецТехСервис</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Мы специализируемся на поставке и обслуживании оборудования для металлопереработки. За более чем 15 лет
            работы мы стали надёжным партнёром для сотен предприятий по всей России.
          </p>
          <p className="text-muted-foreground mb-8">
            Наша команда — это опытные специалисты, которые знают отрасль изнутри. Мы помогаем клиентам подобрать
            оптимальное оборудование, обеспечиваем качественный сервис и поддержку на всех этапах работы.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contacts">
              Связаться с нами
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="aspect-video rounded-xl bg-muted overflow-hidden">
          <img
            src="/industrial-warehouse-heavy-machinery-storage-facil.jpg"
            alt="Офис и склад СпецТехСервис"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <section className="mb-20">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Наши ценности</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <Award className="h-6 w-6" />
              </div>
              <CardTitle>Качество</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Работаем только с проверенными производителями и поставщиками. Каждая единица техники проходит проверку.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle>Партнёрство</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Строим долгосрочные отношения с клиентами. Многие работают с нами с момента основания компании.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle>Доступность</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Работаем по всей России. Доставка, сервис и поддержка — в любом регионе страны.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">История компании</h2>
        <div className="max-w-2xl mx-auto">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-6 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  <Calendar className="h-4 w-4" />
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <div className="font-semibold text-primary">{item.year}</div>
                <div className="font-semibold mt-1">{item.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cases */}
      {cases.length > 0 && (
        <section id="cases" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 text-center">Кейсы</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseStudy) => (
              <Card key={caseStudy.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img
                    src={
                      caseStudy.image_url ||
                      `/placeholder.svg?height=200&width=400&query=industrial project metal processing`
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
        </section>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <section id="docs" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 text-center">Документы</h2>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.name}</div>
                    {doc.description && <div className="text-sm text-muted-foreground truncate">{doc.description}</div>}
                  </div>
                  {doc.file_url && (
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        Скачать
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
