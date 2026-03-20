import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, Mail, Phone, Building, Calendar, Package, MessageSquare } from "lucide-react"
import { LeadStatusForm } from "@/components/admin/lead-status-form"

interface LeadPageProps {
  params: Promise<{ id: string }>
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

async function getLead(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("leads").select("*, product:products(id, name, slug)").eq("id", id).single()

  return data
}

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params
  const lead = await getLead(id)

  if (!lead) {
    notFound()
  }

  const product = lead.product as { id: string; name: string; slug: string } | null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/admin/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к заявкам
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Заявка #{lead.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            Создана {new Date(lead.created_at).toLocaleDateString("ru-RU")} в{" "}
            {new Date(lead.created_at).toLocaleTimeString("ru-RU")}
          </p>
        </div>
        <Badge className={`${statusColors[lead.status]} text-base px-4 py-2`}>
          {statusLabels[lead.status] || lead.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о клиенте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${lead.email}`} className="font-medium hover:text-primary">
                      {lead.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <a href={`tel:${lead.phone}`} className="font-medium hover:text-primary">
                      {lead.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Компания</p>
                    <p className="font-medium">{lead.company || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Имя</p>
                    <p className="font-medium">{lead.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Детали обращения</CardTitle>
              <CardDescription>
                <Badge variant="outline">{typeLabels[lead.type] || lead.type}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Товар</p>
                    <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-primary">
                      {product.name}
                    </Link>
                  </div>
                </div>
              )}

              {lead.message && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Сообщение</p>
                  </div>
                  <p className="whitespace-pre-line">{lead.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Заметки менеджера</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{lead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          <LeadStatusForm lead={lead} />

          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <a href={`mailto:${lead.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Написать письмо
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <a href={`tel:${lead.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Позвонить
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
