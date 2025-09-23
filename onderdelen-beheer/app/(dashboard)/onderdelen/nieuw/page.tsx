"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { generateSKU } from "@/lib/utils"
import Link from "next/link"

export default function NieuwOnderdeelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sku: generateSKU(),
    naam: "",
    beschrijving: "",
    inkoop_prijs: "",
    verkoop_prijs: "",
    voorraad: "",
    min_voorraad: "5",
    max_voorraad: "100",
    locatie: "",
    leverancier: "",
    barcode: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Onderdeel toegevoegd!")
    router.push("/onderdelen")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/onderdelen">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nieuw Onderdeel</h1>
          <p className="text-muted-foreground">Voeg een nieuw onderdeel toe aan uw voorraad</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basis Informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode (optioneel)</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan of voer barcode in"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="naam">Naam *</Label>
              <Input
                id="naam"
                name="naam"
                value={formData.naam}
                onChange={handleChange}
                required
                placeholder="bijv. Remblokken Set Voorzijde"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beschrijving">Beschrijving</Label>
              <textarea
                id="beschrijving"
                name="beschrijving"
                value={formData.beschrijving}
                onChange={handleChange}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Optionele beschrijving van het onderdeel"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prijzen & Voorraad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inkoop_prijs">Inkoop Prijs (€)</Label>
                <Input
                  id="inkoop_prijs"
                  name="inkoop_prijs"
                  type="number"
                  step="0.01"
                  value={formData.inkoop_prijs}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verkoop_prijs">Verkoop Prijs (€) *</Label>
                <Input
                  id="verkoop_prijs"
                  name="verkoop_prijs"
                  type="number"
                  step="0.01"
                  value={formData.verkoop_prijs}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voorraad">Huidige Voorraad</Label>
                <Input
                  id="voorraad"
                  name="voorraad"
                  type="number"
                  value={formData.voorraad}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_voorraad">Min. Voorraad</Label>
                <Input
                  id="min_voorraad"
                  name="min_voorraad"
                  type="number"
                  value={formData.min_voorraad}
                  onChange={handleChange}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_voorraad">Max. Voorraad</Label>
                <Input
                  id="max_voorraad"
                  name="max_voorraad"
                  type="number"
                  value={formData.max_voorraad}
                  onChange={handleChange}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locatie">Locatie</Label>
                <Input
                  id="locatie"
                  name="locatie"
                  value={formData.locatie}
                  onChange={handleChange}
                  placeholder="bijv. A1-03"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leverancier">Leverancier</Label>
                <Input
                  id="leverancier"
                  name="leverancier"
                  value={formData.leverancier}
                  onChange={handleChange}
                  placeholder="Naam van leverancier"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Bezig met opslaan..." : "Onderdeel Toevoegen"}
          </Button>
          <Link href="/onderdelen">
            <Button variant="outline">Annuleren</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}