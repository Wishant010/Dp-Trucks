"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Package,
  ShoppingCart,
  BarChart3,
  Boxes,
  FileText,
  Settings,
  LogOut,
  Home,
  Plus,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Onderdelen", href: "/onderdelen", icon: Package },
  { name: "Nieuw Onderdeel", href: "/onderdelen/nieuw", icon: Plus },
  { name: "Verkoop", href: "/verkoop", icon: ShoppingCart },
  { name: "Voorraad", href: "/voorraad", icon: Boxes },
  { name: "Rapporten", href: "/rapporten", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear both cookie and localStorage
    document.cookie = "authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    localStorage.removeItem("authenticated")
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center gap-2 px-6 bg-gray-800">
        <Package className="h-8 w-8 text-blue-400" />
        <span className="text-xl font-semibold">Onderdelen</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Uitloggen
        </Button>
      </div>
    </div>
  )
}