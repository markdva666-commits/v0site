"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Trash2, ArrowLeft, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Category, Manufacturer, Product } from "@/lib/types"

interface ProductFormProps {
  product: Product | null
  categories: Category[]
  manufacturers: Manufacturer[]
}

export function ProductForm({ product, categories, manufacturers }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    type: product?.type || "equipment",
    category_id: product?.category_id || "",
    manufacturer_id: product?.manufacturer_id || "",
    short_description: product?.short_description || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    price_type: product?.price_type || "request",
    availability: product?.availability || "order",
    is_published: product?.is_published ?? true,
    is_popular: product?.is_popular ?? false,
    specs: JSON.stringify(product?.specs || {}, null, 2),
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
      slug: product?.slug || generateSlug(name),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    try {
      const newImages: string[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Upload failed")

        const { url } = await res.json()
        newImages.push(url)
      }

      setImages([...images, ...newImages])
      toast.success(`Загружено ${newImages.length} изображений`)
    } catch {
      toast.error("Ошибка загрузки изображений")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let specs = {}
      try {
        specs = JSON.parse(formData.specs || "{}")
      } catch {
        toast.error("Неверный формат JSON в характеристиках")
        setLoading(false)
        return
      }

      const body = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku || null,
        type: formData.type,
        category_id: formData.category_id || null,
        manufacturer_id: formData.manufacturer_id || null,
        short_description: formData.short_description || null,
        description: formData.description || null,
        price: formData.price ? Number(formData.price) : null,
        price_type: formData.price_type,
        availability: formData.availability,
        is_published: formData.is_published,
        is_popular: formData.is_popular,
        specs: specs,
        images: images.length > 0 ? images : null,
      }

      const res = await fetch(`/api/admin/products${product ? `/${product.id}` : ""}`, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success(product ? "Товар обновлён" : "Товар создан")
      router.push("/admin/products")
      router.refresh()
    } catch {
      toast.error("Ошибка сохранения")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm("Удалить товар? Это действие нельзя отменить.")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      toast.success("Товар удалён")
      router.push("/admin/products")
      router.refresh()
    } catch {
      toast.error("Ошибка удаления")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ломовоз МЛ-100"
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
                    placeholder="lomovoz-ml-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Артикул</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="ML-100-2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Тип товара *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Оборудование</SelectItem>
                    <SelectItem value="parts">Запчасти</SelectItem>
                    <SelectItem value="service">Услуга</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Краткое описание</Label>
                <Textarea
                  id="short_description"
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Краткое описание для карточки товара"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Полное описание</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробное описание товара"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изображения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Изображение ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  {uploadingImages ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Добавить</span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Поддерживаются форматы JPG, PNG, WebP. Первое изображение будет главным.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Характеристики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="specs">JSON формат</Label>
                <Textarea
                  id="specs"
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder={'{\n  "Грузоподъёмность": "10 тонн",\n  "Мощность двигателя": "300 л.с."\n}'}
                />
                <p className="text-xs text-muted-foreground">Введите характеристики в формате JSON</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Публикация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Опубликован</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_popular">Популярный</Label>
                <Switch
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(v) => setFormData({ ...formData, is_popular: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Категория и производитель</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Производитель</Label>
                <Select
                  value={formData.manufacturer_id}
                  onValueChange={(v) => setFormData({ ...formData, manufacturer_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите производителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((mfr) => (
                      <SelectItem key={mfr.id} value={mfr.id}>
                        {mfr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Цена и наличие</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Цена, ₽</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Тип цены</Label>
                <Select value={formData.price_type} onValueChange={(v) => setFormData({ ...formData, price_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Фиксированная</SelectItem>
                    <SelectItem value="request">По запросу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Наличие</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(v) => setFormData({ ...formData, availability: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">В наличии</SelectItem>
                    <SelectItem value="order">Под заказ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full">
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
              <Link href="/admin/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку
              </Link>
            </Button>
            {product && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить товар
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
