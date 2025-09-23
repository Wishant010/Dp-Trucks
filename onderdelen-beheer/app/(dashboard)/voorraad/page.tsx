"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Package, TrendingDown, RefreshCw, Plus, Minus } from "lucide-react"
import { formatCurrency, getStockStatus } from "@/lib/utils"
import { toast } from "sonner"
import type { Onderdeel } from "@/types"

export default function VoorraadPage() {
  const [selectedItem, setSelectedItem] = useState<Onderdeel | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")

  // Demo data
  const onderdelen: Onderdeel[] = [
    {
      id: "1",
      sku: "OND-2024-001",
      naam: "Remblokken Set Voorzijde",
      inkoop_prijs: 25.50,
      verkoop_prijs: 45.99,
      voorraad: 2,
      min_voorraad: 5,
      max_voorraad: 50,
      locatie: "A1-03",
      leverancier: "AutoParts BV",
      afbeeldingen: [],
      actief: true,
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
    {
      id: "2",
      sku: "OND-2024-002",
      naam: "Oliefilter Universal",
      inkoop_prijs: 8.75,
      verkoop_prijs: 18.50,
      voorraad: 0,
      min_voorraad: 10,
      max_voorraad: 100,
      locatie: "B2-15",
      leverancier: "FilterPro",
      afbeeldingen: [],
      actief: true,
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
    {
      id: "3",
      sku: "OND-2024-003",
      naam: "Luchtfilter Performance",
      inkoop_prijs: 15.00,
      verkoop_prijs: 32.99,
      voorraad: 3,
      min_voorraad: 5,
      max_voorraad: 30,
      locatie: "C3-08",
      leverancier: "FilterPro",
      afbeeldingen: [],
      actief: true,
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
  ]

  const lowStockItems = onderdelen.filter(o => o.voorraad <= o.min_voorraad)
  const outOfStockItems = onderdelen.filter(o => o.voorraad === 0)
  const criticalItems = onderdelen.filter(o => o.voorraad > 0 && o.voorraad <= o.min_voorraad)

  const handleAdjustment = (type: 'add' | 'subtract') => {
    if (!selectedItem || !adjustmentAmount) {
      toast.error("Selecteer een product en voer een hoeveelheid in")
      return
    }

    const amount = parseInt(adjustmentAmount)
    const newStock = type === 'add' 
      ? selectedItem.voorraad + amount 
      : selectedItem.voorraad - amount

    if (newStock < 0) {
      toast.error("Voorraad kan niet negatief zijn")
      return
    }

    toast.success(`Voorraad ${type === 'add' ? 'verhoogd' : 'verlaagd'} met ${amount}`)
    setSelectedItem(null)
    setAdjustmentAmount("")
    setAdjustmentReason("")
  }

  const getSuggestedOrder = (item: Onderdeel) => {
    const toOrder = (item.max_voorraad || item.min_voorraad * 4) - item.voorraad
    return Math.max(0, toOrder)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voorraadbeheer</h1>
        <p className="text-muted-foreground">Beheer voorraadniveaus en waarschuwingen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uit Voorraad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Producten direct bestellen
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritieke Voorraad</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Onder minimum niveau
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Waarschuwingen actief
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voorraad Waarschuwingen</CardTitle>
            <CardDescription>Items die aandacht nodig hebben</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => {
                const status = getStockStatus(item.voorraad, item.min_voorraad)
                const suggested = getSuggestedOrder(item)
                
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{item.naam}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.emoji} {status.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Voorraad</p>
                        <p className="font-semibold">{item.voorraad}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min</p>
                        <p className="font-semibold">{item.min_voorraad}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bestel</p>
                        <p className="font-semibold text-green-600">+{suggested}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedItem(item)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Aanpassen
                      </Button>
                      <Button size="sm">
                        Bestel {suggested} stuks
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voorraad Aanpassen</CardTitle>
            <CardDescription>Handmatige voorraadcorrectie</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedItem.naam}</p>
                  <p className="text-sm text-muted-foreground">
                    Huidige voorraad: {selectedItem.voorraad} stuks
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Hoeveelheid</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    placeholder="Voer hoeveelheid in"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reden (optioneel)</Label>
                  <Input
                    id="reason"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="bijv. Correctie, Retour, Beschadigd"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleAdjustment('add')}
                    disabled={!adjustmentAmount}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Toevoegen
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleAdjustment('subtract')}
                    disabled={!adjustmentAmount}
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Verminderen
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(null)
                    setAdjustmentAmount("")
                    setAdjustmentReason("")
                  }}
                >
                  Annuleren
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecteer een product uit de lijst om de voorraad aan te passen</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}