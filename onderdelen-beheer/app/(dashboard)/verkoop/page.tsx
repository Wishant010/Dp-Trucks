"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import type { Onderdeel } from "@/types"

interface CartItem {
  onderdeel: Onderdeel
  aantal: number
  prijs: number
}

export default function VerkoopPage() {
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'contant' | 'pin' | 'overschrijving'>('contant')
  
  // Demo onderdelen data
  const onderdelen: Onderdeel[] = [
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
      beschrijving: "Universele oliefilter",
      inkoop_prijs: 8.75,
      verkoop_prijs: 18.50,
      voorraad: 8,
      min_voorraad: 10,
      locatie: "B2-15",
      afbeeldingen: [],
      actief: true,
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
  ]

  const filteredOnderdelen = onderdelen.filter(o => 
    o.naam.toLowerCase().includes(search.toLowerCase()) ||
    o.sku.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (onderdeel: Onderdeel) => {
    const existing = cart.find(item => item.onderdeel.id === onderdeel.id)
    if (existing) {
      updateQuantity(onderdeel.id, existing.aantal + 1)
    } else {
      setCart([...cart, { onderdeel, aantal: 1, prijs: onderdeel.verkoop_prijs }])
    }
    toast.success(`${onderdeel.naam} toegevoegd aan winkelwagen`)
  }

  const updateQuantity = (id: string, aantal: number) => {
    if (aantal <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map(item => 
      item.onderdeel.id === id ? { ...item, aantal } : item
    ))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.onderdeel.id !== id))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.prijs * item.aantal), 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Winkelwagen is leeg")
      return
    }
    
    // Process sale
    toast.success("Verkoop succesvol verwerkt!")
    setCart([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quick Sale</h1>
        <p className="text-muted-foreground">Voeg producten toe en reken direct af</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Producten Zoeken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam, SKU of barcode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredOnderdelen.map((onderdeel) => (
                  <div 
                    key={onderdeel.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{onderdeel.naam}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{onderdeel.sku}</span>
                        <span>Voorraad: {onderdeel.voorraad}</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(onderdeel.verkoop_prijs)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(onderdeel)}
                      disabled={onderdeel.voorraad === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Winkelwagen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Winkelwagen is leeg
                </p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.onderdeel.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.onderdeel.naam}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.prijs)} per stuk
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.onderdeel.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.onderdeel.id, item.aantal - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.aantal}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.onderdeel.id, item.aantal + 1)}
                            disabled={item.aantal >= item.onderdeel.voorraad}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(item.prijs * item.aantal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Totaal:</span>
                      <span>{formatCurrency(getTotal())}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>Betaalmethode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={paymentMethod === 'contant' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('contant')}
                        className="text-xs"
                      >
                        <Banknote className="h-3 w-3 mr-1" />
                        Contant
                      </Button>
                      <Button
                        variant={paymentMethod === 'pin' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('pin')}
                        className="text-xs"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Pin
                      </Button>
                      <Button
                        variant={paymentMethod === 'overschrijving' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('overschrijving')}
                        className="text-xs"
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        Over
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Afrekenen ({formatCurrency(getTotal())})
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}