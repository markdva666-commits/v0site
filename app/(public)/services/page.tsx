import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeadForm } from "@/components/lead-form"
import { ChevronRight, Cog, Wrench, Headphones, Search, Truck, FileCheck, ArrowRight } from "lucide-react"

const services = [
  {
    id: "selection",
    icon: Search,
    title: "Подбор оборудования",
    description: "Поможем выбрать технику под ваши задачи и бюджет",
    features: [
      "Анализ ваших производственных потребностей",
      "Подбор оптимальных моделей",
      "Сравнение характеристик и цен",
      "Расчёт окупаемости инвестиций",
    ],
  },
  {
    id: "parts",
    icon: Cog,
    title: "Поставка запчастей",
    description: "Оригинальные и совместимые запчасти с гарантией",
    features: [
      "Подбор по артикулу или описанию",
      "Оригинальные запчасти от производителей",
      "Качественные совместимые аналоги",
      "Склад в Москве для быстрой отгрузки",
    ],
  },
  {
    id: "repair",
    icon: Wrench,
    title: "Сервис и ремонт",
    description: "Техническое обслуживание и ремонт любой сложности",
    features: [
      "Плановое ТО по регламенту",
      "Диагностика и устранение неисправностей",
      "Капитальный ремонт узлов и агрегатов",
      "Выезд специалистов по всей России",
    ],
  },
  {
    id: "support",
    icon: Headphones,
    title: "Техподдержка 24/7",
    description: "Консультации и помощь в экстренных ситуациях",
    features: ["Горячая линия для клиентов", "Удалённая диагностика", "Помощь в эксплуатации", "Обучение персонала"],
  },
]

const additionalServices = [
  {
    icon: Truck,
    title: "Доставка по России",
    description:
      "Организуем доставку оборудования и запчастей в любой регион страны. Работаем с транспортными компаниями и собственным автопарком.",
  },
  {
    icon: FileCheck,
    title: "Документальное сопровождение",
    description:
      "Полный пакет документов: сертификаты, паспорта, инструкции. Помощь в оформлении лизинга и кредита на оборудование.",
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Услуги</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Услуги</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Полный цикл поддержки: от подбора оборудования до сервисного обслуживания
        </p>
      </div>

      {/* Main Services */}
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {services.map((service) => (
          <Card key={service.id} id={service.id} className="scroll-mt-24">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <service.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={`/contacts#form`}>
                  Оставить заявку
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Services */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Дополнительно</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {additionalServices.map((service, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <service.icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="scroll-mt-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Заказать услугу</CardTitle>
            <CardDescription>Опишите вашу задачу — мы свяжемся для уточнения деталей</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadForm type="general" />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
