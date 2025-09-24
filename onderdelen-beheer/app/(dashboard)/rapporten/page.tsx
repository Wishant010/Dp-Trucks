"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Package, AlertTriangle, BarChart3, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import * as XLSX from "xlsx"
import type { Onderdeel } from "@/types"

export default function RapportenPage() {
  const [loading, setLoading] = useState(false)
  const [onderdelen, setOnderdelen] = useState<Onderdeel[]>([])
  const [lageVoorraad, setLageVoorraad] = useState<Onderdeel[]>([])
  const [stats, setStats] = useState({
    totaalOnderdelen: 0,
    voorraadWaarde: 0,
    lageVoorraadItems: 0,
    uitVoorraadItems: 0,
  })

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: onderdelenData } = await supabase
        .from('onderdelen')
        .select('*')
        .eq('actief', true)
        .order('naam')

      const onderData = onderdelenData || []
      setOnderdelen(onderData)

      const lowStock = onderData.filter((o: any) => o.voorraad <= o.min_voorraad)
      setLageVoorraad(lowStock)

      const totaalWaarde = onderData.reduce((sum: any, o: any) => sum + (o.voorraad * o.inkoop_prijs), 0)
      const uitVoorraad = onderData.filter((o: any) => o.voorraad === 0)

      setStats({
        totaalOnderdelen: onderData.length,
        voorraadWaarde: totaalWaarde,
        lageVoorraadItems: lowStock.length,
        uitVoorraadItems: uitVoorraad.length,
      })
    } catch (error) {
      toast.error('Fout bij ophalen van data')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportVoorraadToExcel = () => {
    const data = onderdelen.map((o: any, i: number) => ({
      'Nr': i + 1,
      'SKU': o.sku,
      'Naam': o.naam,
      'Voorraad': o.voorraad,
      'Min Voorraad': o.min_voorraad,
      'Inkoop Prijs': o.inkoop_prijs,
      'Waarde': (o.voorraad * o.inkoop_prijs),
      'Locatie': o.locatie || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Voorraad')
    XLSX.writeFile(workbook, `voorraad_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel bestand geëxporteerd!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voorraad Rapporten</h1>
        <p className="text-muted-foreground">Analyseer uw voorraad en onderdelen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voorraad Overzicht</CardTitle>
            <div className="bg-blue-50 p-2 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Volledige voorraadlijst exporteren
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={exportVoorraadToExcel}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <Download className="h-3 w-3 mr-2" />
              )}
              Export Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lage Voorraad Alert</CardTitle>
            <CardDescription>Items die bijbesteld moeten worden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lageVoorraad.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium">{item.naam}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.sku} | Voorraad: {item.voorraad} / Min: {item.min_voorraad}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-red-600">
                    Tekort: {item.min_voorraad - item.voorraad}
                  </p>
                </div>
              ))}
              {lageVoorraad.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Geen items met lage voorraad
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voorraad Samenvatting</CardTitle>
          <CardDescription>Overzicht van uw totale voorraad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.totaalOnderdelen}</p>
              <p className="text-sm text-muted-foreground">Totaal Onderdelen</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold">{formatCurrency(stats.voorraadWaarde)}</p>
              <p className="text-sm text-muted-foreground">Voorraad Waarde</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.lageVoorraadItems}</p>
              <p className="text-sm text-muted-foreground">Lage Voorraad</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.uitVoorraadItems}</p>
              <p className="text-sm text-muted-foreground">Uit Voorraad</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
