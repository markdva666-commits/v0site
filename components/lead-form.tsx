"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"

interface LeadFormProps {
  productId?: string
  productName?: string
  type?: "quote" | "part" | "repair" | "general"
  className?: string
}

export function LeadForm({ productId, productName, type = "general", className }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: type,
    message: productName ? `Интересует: ${productName}` : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          product_id: productId,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.")
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        type: type,
        message: "",
      })
    } catch {
      toast.error("Ошибка отправки. Попробуйте позже или позвоните нам.")
    } finally {
      setLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    quote: "Запрос КП",
    part: "Подбор запчасти",
    repair: "Заявка на ремонт",
    general: "Общий вопрос",
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ваше имя *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Иван Петров"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Компания</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder='ООО "Металлсервис"'
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ivan@company.ru"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="type">Тип обращения</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">Сообщение</Label>
          <Textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Опишите ваш запрос подробнее..."
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Отправить заявку
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  )
}
