"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, FolderTree, Factory, FileText, Users, Settings, Wrench } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/manufacturers", label: "Производители", icon: Factory },
  { href: "/admin/leads", label: "Заявки", icon: Users },
  { href: "/admin/documents", label: "Документы", icon: FileText },
  { href: "/admin/cases", label: "Кейсы", icon: FileText },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card hidden lg:block">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Wrench className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold text-sm">СпецТехСервис</div>
          <div className="text-xs text-muted-foreground">Админ-панель</div>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
