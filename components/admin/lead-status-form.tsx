"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import type { Lead } from "@/lib/types"

interface LeadStatusFormProps {
  lead: Lead
}

const statuses = [
  { value: "new", label: "Новая" },
  { value: "processing", label: "В работе" },
  { value: "completed", label: "Завершена" },
  { value: "cancelled", label: "Отменена" },
]

export function LeadStatusForm({ lead }: LeadStatusFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(lead.status)
  const [notes, setNotes] = useState(lead.notes || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })

      if (!res.ok) throw new Error("Failed to update")

      toast.success("Заявка обновлена")
      router.refresh()
    } catch {
      toast.error("Ошибка сохранения")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заявкой</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Статус</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Внутренние заметки по заявке..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
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
        </form>
      </CardContent>
    </Card>
  )
}
