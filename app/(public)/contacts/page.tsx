import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeadForm } from "@/components/lead-form"
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react"

const contacts = [
  {
    icon: Phone,
    title: "Телефон",
    value: "8 (800) 123-45-67",
    href: "tel:+78001234567",
    description: "Бесплатно по России",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@spectehservice.ru",
    href: "mailto:info@spectehservice.ru",
    description: "Ответим в течение 2 часов",
  },
  {
    icon: MapPin,
    title: "Адрес",
    value: "г. Москва, ул. Промышленная, д. 15",
    href: "https://maps.google.com",
    description: "Офис и склад",
  },
  {
    icon: Clock,
    title: "Режим работы",
    value: "Пн-Пт: 9:00-18:00",
    description: "Сб-Вс: выходной",
  },
]

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Контакты</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Контакты</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Свяжитесь с нами любым удобным способом — мы всегда на связи
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Info */}
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map((contact, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <contact.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{contact.title}</div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="font-semibold hover:text-primary transition-colors"
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <div className="font-semibold">{contact.value}</div>
                  )}
                  {contact.description && (
                    <div className="text-sm text-muted-foreground mt-1">{contact.description}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map placeholder */}
          <Card className="mt-6 overflow-hidden">
            <div className="aspect-video bg-muted">
              <img
                src="/moscow-map-industrial-district.jpg"
                alt="Карта расположения офиса"
                className="h-full w-full object-cover"
              />
            </div>
          </Card>
        </div>

        {/* Form */}
        <div id="form" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle>Оставить заявку</CardTitle>
              <CardDescription>Заполните форму и мы свяжемся с вами в ближайшее время</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm type="general" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
