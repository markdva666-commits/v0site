import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"

async function getDocuments() {
  const supabase = await createClient()
  const { data } = await supabase.from("documents").select("*").order("sort_order")
  return data || []
}

export default async function AdminDocumentsPage() {
  const documents = await getDocuments()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Документы</h1>
          <p className="text-muted-foreground">Управление документами компании</p>
        </div>
        <Button asChild>
          <Link href="/admin/documents/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить документ
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список документов ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type || "Документ"}</Badge>
                    </TableCell>
                    <TableCell>
                      {doc.is_public ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="mr-1 h-3 w-3" />
                          Публичный
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Скрыт
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/documents/${doc.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Документов пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
