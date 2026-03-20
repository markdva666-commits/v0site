import Link from "next/link"
import { Wrench, Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  catalog: [
    { name: "Ломовозы", href: "/catalog?category=lomovoz" },
    { name: "Гидроманипуляторы", href: "/catalog?category=gidro" },
    { name: "Перегружатели", href: "/catalog?category=peregruz" },
    { name: "Пресс-ножницы", href: "/catalog?category=press" },
  ],
  services: [
    { name: "Подбор оборудования", href: "/services#selection" },
    { name: "Поставка запчастей", href: "/services#parts" },
    { name: "Сервис и ремонт", href: "/services#repair" },
    { name: "Техподдержка", href: "/services#support" },
  ],
  company: [
    { name: "О компании", href: "/about" },
    { name: "Кейсы", href: "/about#cases" },
    { name: "Документы", href: "/about#docs" },
    { name: "Контакты", href: "/contacts" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Contacts */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold">СпецТехСервис</div>
                <div className="text-xs text-muted-foreground">Оборудование для металлопереработки</div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Поставка и обслуживание оборудования для переработки металлолома. Работаем по всей России.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="tel:+78001234567"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-muted-foreground" />8 (800) 123-45-67
              </a>
              <a
                href="mailto:info@spectehservice.ru"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                info@spectehservice.ru
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                г. Москва, ул. Промышленная, д. 15
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2">
              {footerLinks.catalog.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} СпецТехСервис. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
