"use client"

import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { Menu, LogOut, ExternalLink, UserIcon } from "lucide-react"
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

export function AdminHeader({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || "AD"

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
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
          </SheetContent>
        </Sheet>

        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            Перейти на сайт
          </Link>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <UserIcon className="mr-2 h-4 w-4" />
              Профиль
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
