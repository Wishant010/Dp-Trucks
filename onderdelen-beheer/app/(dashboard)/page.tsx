"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Euro, Boxes } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { DashboardStats } from "@/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totaal_onderdelen: 0,
    voorraad_waarde: 0,
    lage_voorraad: 0,
    uit_voorraad: 0,
    verkopen_vandaag: 0,
    omzet_vandaag: 0,
    winst_vandaag: 0,
  })

  useEffect(() => {
    // Demo data - in production this would fetch from Supabase
    setStats({
      totaal_onderdelen: 156,
      voorraad_waarde: 15420.50,
      lage_voorraad: 12,
      uit_voorraad: 3,
      verkopen_vandaag: 8,
      omzet_vandaag: 458.75,
      winst_vandaag: 125.30,
    })
  }, [])

  const statsCards = [
    {
      title: "Totale Onderdelen",
      value: stats.totaal_onderdelen.toString(),
      description: "Actieve onderdelen in voorraad",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Voorraad Waarde",
      value: formatCurrency(stats.voorraad_waarde),
      description: "Totale waarde van voorraad",
      icon: Euro,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Verkopen Vandaag",
      value: stats.verkopen_vandaag.toString(),
      description: `Omzet: ${formatCurrency(stats.omzet_vandaag)}`,
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Waarschuwingen",
      value: (stats.lage_voorraad + stats.uit_voorraad).toString(),
      description: `${stats.uit_voorraad} uit voorraad, ${stats.lage_voorraad} laag`,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overzicht van uw voorraad en verkopen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recente Verkopen</CardTitle>
            <CardDescription>Laatste 5 verkopen van vandaag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Remblokken Set</p>
                    <p className="text-sm text-muted-foreground">2 stuks - 14:30</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(45.50)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lage Voorraad Alert</CardTitle>
            <CardDescription>Onderdelen die bijbesteld moeten worden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Oliefilter", voorraad: 2, min: 10 },
                { name: "Luchtfilter", voorraad: 0, min: 5 },
                { name: "Remvloeistof", voorraad: 3, min: 15 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Voorraad: {item.voorraad} / Min: {item.min}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.voorraad === 0 ? (
                      <span className="text-red-600 font-semibold">Uit voorraad</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">Laag</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}