import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

interface ProductEditPageProps {
  params: Promise<{ id: string }>
}

async function getProductData(id: string) {
  const supabase = await createClient()

  const isNew = id === "new"

  const [categoriesRes, manufacturersRes, productRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("manufacturers").select("*").order("name"),
    isNew ? Promise.resolve({ data: null }) : supabase.from("products").select("*").eq("id", id).single(),
  ])

  if (!isNew && !productRes.data) {
    return null
  }

  return {
    product: productRes.data,
    categories: categoriesRes.data || [],
    manufacturers: manufacturersRes.data || [],
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params
  const data = await getProductData(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.product ? "Редактирование товара" : "Новый товар"}</h1>
        <p className="text-muted-foreground">
          {data.product ? `Редактирование: ${data.product.name}` : "Заполните данные нового товара"}
        </p>
      </div>

      <ProductForm product={data.product} categories={data.categories} manufacturers={data.manufacturers} />
    </div>
  )
}
