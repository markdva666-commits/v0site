import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Eye, Filter } from "lucide-react"

interface LeadsPageProps {
  searchParams: Promise<{ status?: string }>
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  processing: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
}

const statusColors: Record<string, string> = {
  new: "bg-orange-100 text-orange-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
}

const typeLabels: Record<string, string> = {
  quote: "Запрос КП",
  part: "Подбор запчасти",
  repair: "Заявка на ремонт",
  general: "Общий вопрос",
}

async function getLeads(status?: string) {
  const supabase = await createClient()
  let query = supabase.from("leads").select("*, product:products(name)").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data } = await query
  return data || []
}

async function LeadsContent({ searchParams }: LeadsPageProps) {
  const params = await searchParams
  const leads = await getLeads(params.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="text-muted-foreground">Управление заявками от клиентов</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={!params.status ? "default" : "outline"} size="sm">
          <Link href="/admin/leads">
            <Filter className="mr-2 h-4 w-4" />
            Все
          </Link>
        </Button>
        {Object.entries(statusLabels).map(([value, label]) => (
          <Button key={value} asChild variant={params.status === value ? "default" : "outline"} size="sm">
            <Link href={`/admin/leads?status=${value}`}>{label}</Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заявок ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Товар</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-sm">
                      {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                      <br />
                      <span className="text-muted-foreground">
                        {new Date(lead.created_at).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.company || lead.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[lead.type] || lead.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {(lead.product as { name: string } | null)?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>{statusLabels[lead.status] || lead.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Заявок пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function LeadsPage(props: LeadsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-96 bg-muted rounded animate-pulse" />
        </div>
      }
    >
      <LeadsContent {...props} />
    </Suspense>
  )
}
