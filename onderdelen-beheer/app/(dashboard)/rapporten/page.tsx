"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, TrendingUp, Package, Euro, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function RapportenPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'dag' | 'week' | 'maand' | 'jaar'>('maand')

  const reports = [
    {
      title: "Verkoop Overzicht",
      description: "Gedetailleerd verkooprapport",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Voorraad Waardering",
      description: "Huidige voorraadwaarde",
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Winst & Verlies",
      description: "Financieel overzicht",
      icon: Euro,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Dode Voorraad",
      description: "Items zonder verkoop",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  const topProducts = [
    { naam: "Remblokken Set", verkocht: 45, omzet: 2069.55 },
    { naam: "Oliefilter Universal", verkocht: 38, omzet: 703.00 },
    { naam: "Luchtfilter Performance", verkocht: 28, omzet: 923.72 },
    { naam: "Bougies Set", verkocht: 24, omzet: 359.76 },
    { naam: "Ruitenwissers", verkocht: 19, omzet: 474.81 },
  ]

  const categoryPerformance = [
    { categorie: "Remsysteem", items: 156, verkocht: 89, omzet: 4521.30 },
    { categorie: "Motor", items: 98, verkocht: 67, omzet: 3890.15 },
    { categorie: "Elektronica", items: 45, verkocht: 34, omzet: 2156.80 },
    { categorie: "Carrosserie", items: 78, verkocht: 23, omzet: 1234.50 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rapporten</h1>
          <p className="text-muted-foreground">Analyseer uw bedrijfsprestaties</p>
        </div>
        <div className="flex gap-2">
          {(['dag', 'week', 'maand', 'jaar'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {report.title}
              </CardTitle>
              <div className={`${report.bg} p-2 rounded-lg`}>
                <report.icon className={`h-4 w-4 ${report.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {report.description}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-3 w-3 mr-2" />
                Genereer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Producten</CardTitle>
            <CardDescription>Meest verkochte items deze {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-lg text-muted-foreground w-6">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.naam}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.verkocht} verkocht
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(product.omzet)}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export naar Excel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorie Prestaties</CardTitle>
            <CardDescription>Verkopen per categorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryPerformance.map((cat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{cat.categorie}</p>
                      <p className="text-sm text-muted-foreground">
                        {cat.items} producten
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(cat.omzet)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(cat.verkocht / cat.items) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((cat.verkocht / cat.items) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Rapport
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Samenvatting</CardTitle>
          <CardDescription>Overzicht voor {selectedPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{formatCurrency(12450.75)}</p>
              <p className="text-sm text-muted-foreground">Totale Omzet</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{formatCurrency(3890.25)}</p>
              <p className="text-sm text-muted-foreground">Bruto Winst</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">213</p>
              <p className="text-sm text-muted-foreground">Verkopen</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">31.2%</p>
              <p className="text-sm text-muted-foreground">Winstmarge</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}