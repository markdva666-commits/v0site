import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil } from "lucide-react"

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("sort_order")
  return data || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  const categoriesById = new Map(categories.map((category) => [category.id, category]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Категории</h1>
          <p className="text-muted-foreground">Управление категориями товаров</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить категорию
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список категорий ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">
                      {cat.parent_id ? <span className="mr-1 text-muted-foreground">--</span> : null}
                      {cat.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{cat.slug}</TableCell>
                    <TableCell>{categoriesById.get(cat.parent_id || "")?.name || cat.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/categories/${cat.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Категорий пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
