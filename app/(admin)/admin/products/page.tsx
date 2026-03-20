import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name), manufacturer:manufacturers(name)")
    .order("created_at", { ascending: false })
  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Товары</h1>
          <p className="text-muted-foreground">Управление каталогом оборудования</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить товар
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список товаров ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                          <img
                            src={
                              (product.images as string[])?.[0] ||
                              `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          {product.manufacturer && (
                            <p className="text-xs text-muted-foreground">
                              {(product.manufacturer as { name: string }).name}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="secondary">{(product.category as { name: string }).name}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku || "-"}</TableCell>
                    <TableCell>
                      {product.price ? `${new Intl.NumberFormat("ru-RU").format(product.price)} ₽` : "По запросу"}
                    </TableCell>
                    <TableCell>
                      {product.is_published ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="mr-1 h-3 w-3" />
                          Активен
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
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Товаров пока нет</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
