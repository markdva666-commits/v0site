import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "@/components/admin/category-form"

interface CategoryEditPageProps {
  params: Promise<{ id: string }>
}

async function getCategoryData(id: string) {
  const supabase = await createClient()
  const isNew = id === "new"

  if (isNew) {
    return { category: null }
  }

  const { data } = await supabase.from("categories").select("*").eq("id", id).single()

  if (!data) {
    return null
  }

  return { category: data }
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { id } = await params
  const data = await getCategoryData(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.category ? "Редактирование категории" : "Новая категория"}</h1>
        <p className="text-muted-foreground">
          {data.category ? `Редактирование: ${data.category.name}` : "Заполните данные новой категории"}
        </p>
      </div>

      <CategoryForm category={data.category} />
    </div>
  )
}
