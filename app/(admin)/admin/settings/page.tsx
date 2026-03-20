import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">Управление системой</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профиль администратора</CardTitle>
          <CardDescription>Информация о текущем пользователе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
