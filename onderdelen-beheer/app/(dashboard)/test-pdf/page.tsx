"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestPDFPage() {

  const testSimplePDF = () => {
    try {
      // Test if jsPDF loads
      const jsPDF = require('jspdf')
      const doc = new jsPDF.default()

      doc.text('Test PDF Document', 20, 20)
      doc.text('Als je dit ziet, werkt PDF generatie!', 20, 30)

      // Download the PDF
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'test.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Test PDF gegenereerd!')
    } catch (error: any) {
      console.error('PDF Error:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  const testWithAutoTable = () => {
    try {
      const jsPDF = require('jspdf')
      require('jspdf-autotable')

      const doc = new jsPDF.default()

      doc.text('Test met Tabel', 20, 20)

      // Test autoTable
      doc.autoTable({
        head: [['Naam', 'Prijs', 'Voorraad']],
        body: [
          ['Remblokken', '€45.99', '15'],
          ['Oliefilter', '€18.50', '8'],
          ['Luchtfilter', '€32.99', '3'],
        ],
        startY: 30,
      })

      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'test-table.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Test PDF met tabel gegenereerd!')
    } catch (error: any) {
      console.error('PDF Table Error:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  const testPDFGenerator = () => {
    try {
      const { PDFGenerator } = require('@/lib/pdf-generator')
      const pdfGen = new PDFGenerator()

      // Test with minimal data
      const testData = [{
        id: '1',
        onderdeel: { naam: 'Test Product', sku: 'TEST-001' },
        aantal: 1,
        stuk_prijs: 10,
        totaal_prijs: 10,
        verkocht_op: new Date().toISOString(),
        betaalmethode: 'contant'
      }]

      const blob = pdfGen.generateVerkoopRapport(
        testData,
        'dag',
        new Date(),
        new Date()
      )

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'test-generator.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('PDFGenerator test succesvol!')
    } catch (error: any) {
      console.error('PDFGenerator Error:', error)
      toast.error(`Generator Error: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PDF Test Pagina</h1>
        <p className="text-muted-foreground">Debug PDF generatie problemen</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Test 1: Basis jsPDF</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testSimplePDF}>
              Test Simple PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test 2: jsPDF met AutoTable</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testWithAutoTable}>
              Test PDF met Tabel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test 3: PDFGenerator Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testPDFGenerator}>
              Test PDFGenerator
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}