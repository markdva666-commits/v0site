"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategoryFormProps {
  category: Category | null
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    sort_order: category?.sort_order?.toString() || "0",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map: Record<string, string> = {
          а: "a",
          б: "b",
          в: "v",
          г: "g",
          д: "d",
          е: "e",
          ё: "e",
          ж: "zh",
          з: "z",
          и: "i",
          й: "y",
          к: "k",
          л: "l",
          м: "m",
          н: "n",
          о: "o",
          п: "p",
          р: "r",
          с: "s",
          т: "t",
          у: "u",
          ф: "f",
          х: "h",
          ц: "ts",
          ч: "ch",
          ш: "sh",
          щ: "sch",
          ъ: "",
          ы: "y",
          ь: "",
          э: "e",
          ю: "yu",
          я: "ya",
        }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category?.slug || generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const body = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        sort_order: Number(formData.sort_order) || 0,
      }

      const res = await fetch(`/api/admin/categories${category ? `/${category.id}` : ""}`, {
        method: category ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success(category ? "Категория обновлена" : "Категория создана")
      router.push("/admin/categories")
      router.refresh()
    } catch {
      toast.error("Ошибка сохранения")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!category || !confirm("Удалить категорию? Это действие нельзя отменить.")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      toast.success("Категория удалена")
      router.push("/admin/categories")
      router.refresh()
    } catch {
      toast.error("Ошибка удаления")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация о категории</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ломовозы"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL (slug) *</Label>
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="lomovozy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Порядок сортировки</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание категории"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Link>
          </Button>
          {category && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Удалить
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
