import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil } from "lucide-react"

async function getManufacturers() {
  const supabase = await createClient()
  const { data } = await supabase.from("manufacturers").select("*").order("name")
  return data || []
}

export default async function AdminManufacturersPage() {
  const manufacturers = await getManufacturers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Производители</h1>
          <p className="text-muted-foreground">Управление производителями оборудования</p>
        </div>
        <Button asChild>
          <Link href="/admin/manufacturers/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить производителя
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список производителей ({manufacturers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {manufacturers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Страна</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturers.map((mfr) => (
                  <TableRow key={mfr.id}>
                    <TableCell className="font-medium">{mfr.name}</TableCell>
                    <TableCell className="font-mono text-sm">{mfr.slug}</TableCell>
                    <TableCell>{mfr.country || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/manufacturers/${mfr.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Производителей пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
