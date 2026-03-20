import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"

async function getCases() {
  const supabase = await createClient()
  const { data } = await supabase.from("case_studies").select("*").order("created_at", { ascending: false })
  return data || []
}

export default async function AdminCasesPage() {
  const cases = await getCases()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Кейсы</h1>
          <p className="text-muted-foreground">Управление кейсами компании</p>
        </div>
        <Button asChild>
          <Link href="/admin/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить кейс
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список кейсов ({cases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.title}</TableCell>
                    <TableCell>{caseItem.client_name || "-"}</TableCell>
                    <TableCell>
                      {caseItem.is_published ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="mr-1 h-3 w-3" />
                          Опубликован
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Черновик
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/cases/${caseItem.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Кейсов пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
