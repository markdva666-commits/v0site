import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "СпецТехСервис — Оборудование для переработки металла",
  description:
    "Поставка оборудования для металлопереработки: ломовозы, гидроманипуляторы, перегружатели, пресс-ножницы. Запчасти и сервис.",
  keywords: "ломовоз, гидроманипулятор, перегружатель, пресс-ножницы, металлолом, спецтехника",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
