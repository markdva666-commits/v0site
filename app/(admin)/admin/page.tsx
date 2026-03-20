import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, FolderTree, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  const supabase = await createClient()

  const [productsRes, categoriesRes, leadsRes, newLeadsRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ])

  return {
    products: productsRes.count || 0,
    categories: categoriesRes.count || 0,
    leads: leadsRes.count || 0,
    newLeads: newLeadsRes.count || 0,
  }
}

async function getRecentLeads() {
  const supabase = await createClient()
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentLeads = await getRecentLeads()

  const statCards = [
    {
      title: "Товаров",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Категорий",
      value: stats.categories,
      icon: FolderTree,
      href: "/admin/categories",
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Заявок",
      value: stats.leads,
      icon: Users,
      href: "/admin/leads",
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Новых заявок",
      value: stats.newLeads,
      icon: TrendingUp,
      href: "/admin/leads?status=new",
      color: "text-orange-600 bg-orange-100",
    },
  ]

  const statusLabels: Record<string, string> = {
    new: "Новая",
    processing: "В работе",
    completed: "Завершена",
    cancelled: "Отменена",
  }

  const typeLabels: Record<string, string> = {
    quote: "Запрос КП",
    part: "Подбор запчасти",
    repair: "Заявка на ремонт",
    general: "Общий вопрос",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <p className="text-muted-foreground">Обзор системы управления</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Последние заявки</CardTitle>
          <CardDescription>Новые обращения от клиентов</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLeads.length > 0 ? (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.company || lead.email} • {typeLabels[lead.type] || lead.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        lead.status === "new"
                          ? "bg-orange-100 text-orange-700"
                          : lead.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : lead.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Заявок пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
