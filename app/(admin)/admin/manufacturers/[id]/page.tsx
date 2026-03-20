import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ManufacturerForm } from "@/components/admin/manufacturer-form"

interface ManufacturerEditPageProps {
  params: Promise<{ id: string }>
}

async function getManufacturerData(id: string) {
  const supabase = await createClient()
  const isNew = id === "new"

  if (isNew) {
    return { manufacturer: null }
  }

  const { data } = await supabase.from("manufacturers").select("*").eq("id", id).single()

  if (!data) {
    return null
  }

  return { manufacturer: data }
}

export default async function ManufacturerEditPage({ params }: ManufacturerEditPageProps) {
  const { id } = await params
  const data = await getManufacturerData(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {data.manufacturer ? "Редактирование производителя" : "Новый производитель"}
        </h1>
        <p className="text-muted-foreground">
          {data.manufacturer ? `Редактирование: ${data.manufacturer.name}` : "Заполните данные нового производителя"}
        </p>
      </div>

      <ManufacturerForm manufacturer={data.manufacturer} />
    </div>
  )
}
