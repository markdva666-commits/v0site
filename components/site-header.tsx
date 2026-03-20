"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Mail, Wrench } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/catalog" },
  { name: "Услуги", href: "/services" },
  { name: "О компании", href: "/about" },
  { name: "Контакты", href: "/contacts" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden border-b bg-muted/50 md:block">
        <div className="container mx-auto flex h-10 items-center justify-between px-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="tel:+78001234567" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />8 (800) 123-45-67
            </a>
            <a
              href="mailto:info@spectehservice.ru"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@spectehservice.ru
            </a>
          </div>
          <div className="text-sm text-muted-foreground">Пн-Пт: 9:00-18:00</div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-bold leading-none">СпецТехСервис</div>
            <div className="text-xs text-muted-foreground">Оборудование для металлопереработки</div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contacts#form">Запросить КП</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/contacts#form" onClick={() => setOpen(false)}>
                    Запросить КП
                  </Link>
                </Button>
              </nav>
              <div className="mt-8 space-y-3 border-t pt-6">
                <a
                  href="tel:+78001234567"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />8 (800) 123-45-67
                </a>
                <a
                  href="mailto:info@spectehservice.ru"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  info@spectehservice.ru
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
