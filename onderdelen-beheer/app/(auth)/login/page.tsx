"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, Package } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simple demo authentication - in production use environment variable
    if (code === "demo2024" || code === process.env.NEXT_PUBLIC_ACCESS_CODE) {
      // Set cookie for middleware
      document.cookie = "authenticated=true; path=/; max-age=86400"
      localStorage.setItem("authenticated", "true")
      toast.success("Welkom terug!")

      // Force navigation with window.location for cookie to take effect
      window.location.href = "/"
    } else {
      toast.error("Onjuiste toegangscode")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Onderdelen Beheer
          </CardTitle>
          <CardDescription className="text-center">
            Voer uw toegangscode in om door te gaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Toegangscode</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  placeholder="Voer toegangscode in"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Bezig met inloggen..." : "Inloggen"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Demo code: <code className="bg-muted px-1 py-0.5 rounded">demo2024</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}