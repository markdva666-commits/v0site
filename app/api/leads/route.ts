import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, type, message, product_id } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email and phone are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        company,
        email,
        phone,
        type: type || "general",
        message,
        product_id: product_id || null,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
    }

    // TODO: Send email notification here

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
