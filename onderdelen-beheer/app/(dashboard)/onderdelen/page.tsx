"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { formatCurrency, getStockStatus } from "@/lib/utils"
import type { Onderdeel } from "@/types"

export default function OnderdelenPage() {
  const [onderdelen, setOnderdelen] = useState<Onderdeel[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    // Demo data
    setOnderdelen([
      {
        id: "1",
        sku: "OND-2024-001",
        naam: "Remblokken Set Voorzijde",
        beschrijving: "Premium remblokken voor voorzijde",
        inkoop_prijs: 25.50,
        verkoop_prijs: 45.99,
        voorraad: 15,
        min_voorraad: 5,
        locatie: "A1-03",
        afbeeldingen: [],
        actief: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
      {
        id: "2",
        sku: "OND-2024-002",
        naam: "Oliefilter Universal",
        beschrijving: "Universele oliefilter voor meerdere modellen",
        inkoop_prijs: 8.75,
        verkoop_prijs: 18.50,
        voorraad: 2,
        min_voorraad: 10,
        locatie: "B2-15",
        afbeeldingen: [],
        actief: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
      {
        id: "3",
        sku: "OND-2024-003",
        naam: "Luchtfilter Performance",
        beschrijving: "High-flow performance luchtfilter",
        inkoop_prijs: 15.00,
        verkoop_prijs: 32.99,
        voorraad: 0,
        min_voorraad: 5,
        locatie: "C3-08",
        afbeeldingen: [],
        actief: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
    ])
  }, [])

  const filteredOnderdelen = onderdelen.filter((onderdeel) =>
    onderdeel.naam.toLowerCase().includes(search.toLowerCase()) ||
    onderdeel.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Onderdelen</h1>
          <p className="text-muted-foreground">Beheer uw onderdelenvoorraad</p>
        </div>
        <Link href="/onderdelen/nieuw">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Onderdeel
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op naam of SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOnderdelen.map((onderdeel) => {
          const status = getStockStatus(onderdeel.voorraad, onderdeel.min_voorraad)
          
          return (
            <Card key={onderdeel.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{onderdeel.sku}</p>
                      <h3 className="font-semibold">{onderdeel.naam}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voorraad:</span>
                    <div className="flex items-center gap-2">
                      <span className={status.emoji}></span>
                      <span className={`font-medium ${status.color}`}>
                        {onderdeel.voorraad} stuks
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prijs:</span>
                    <span className="font-semibold">{formatCurrency(onderdeel.verkoop_prijs)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Locatie:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {onderdeel.locatie}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/onderdelen/${onderdeel.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Bewerken
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOnderdelen.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Geen onderdelen gevonden</p>
            <p className="text-muted-foreground">
              {search ? "Probeer een andere zoekterm" : "Voeg uw eerste onderdeel toe"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}