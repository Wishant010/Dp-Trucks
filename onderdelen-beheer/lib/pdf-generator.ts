import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Verkoop, Onderdeel } from '@/types'

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

export class PDFGenerator {
  private doc: jsPDF
  
  constructor() {
    this.doc = new jsPDF()
  }

  private addHeader(title: string, subtitle?: string) {
    // Company info
    this.doc.setFontSize(20)
    this.doc.text('Onderdelen Beheer', 20, 20)
    
    this.doc.setFontSize(10)
    this.doc.setTextColor(100)
    this.doc.text('Voorraadbeheersysteem', 20, 27)
    
    // Report title
    this.doc.setFontSize(16)
    this.doc.setTextColor(0)
    this.doc.text(title, 20, 40)
    
    if (subtitle) {
      this.doc.setFontSize(10)
      this.doc.setTextColor(100)
      this.doc.text(subtitle, 20, 47)
    }
    
    // Date
    this.doc.setFontSize(10)
    this.doc.text(`Gegenereerd op: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: nl })}`, 20, 57)
    
    // Line separator
    this.doc.setDrawColor(200)
    this.doc.line(20, 60, 190, 60)
  }

  private addFooter(pageNumber: number) {
    this.doc.setFontSize(8)
    this.doc.setTextColor(150)
    this.doc.text(
      `Pagina ${pageNumber} - ${format(new Date(), 'yyyy')} © Onderdelen Beheer`,
      105,
      290,
      { align: 'center' }
    )
  }

  generateVerkoopRapport(
    verkopen: Verkoop[],
    periode: 'dag' | 'week' | 'maand' | 'jaar',
    startDate: Date,
    endDate: Date
  ): Blob {
    this.doc = new jsPDF()
    
    const periodeText = {
      dag: 'Dagelijks',
      week: 'Wekelijks',
      maand: 'Maandelijks',
      jaar: 'Jaarlijks'
    }[periode]
    
    this.addHeader(
      'Verkoop Overzicht',
      `${periodeText} rapport - ${format(startDate, 'dd-MM-yyyy')} tot ${format(endDate, 'dd-MM-yyyy')}`
    )

    // Summary stats
    const totaalOmzet = verkopen.reduce((sum, v) => sum + v.totaal_prijs, 0)
    const totaalWinst = verkopen.reduce((sum, v) => {
      const winst = v.inkoop_prijs ? (v.totaal_prijs - (v.aantal * v.inkoop_prijs)) : 0
      return sum + winst
    }, 0)
    
    this.doc.setFontSize(12)
    let yPos = 70
    
    // Summary box
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(20, yPos, 170, 30, 'F')
    
    this.doc.setFontSize(10)
    this.doc.text(`Totaal verkopen: ${verkopen.length}`, 30, yPos + 10)
    this.doc.text(`Totale omzet: € ${totaalOmzet.toFixed(2)}`, 30, yPos + 20)
    this.doc.text(`Totale winst: € ${totaalWinst.toFixed(2)}`, 100, yPos + 10)
    this.doc.text(`Winstmarge: ${((totaalWinst / totaalOmzet) * 100).toFixed(1)}%`, 100, yPos + 20)
    
    // Sales table
    const tableData = verkopen.map(v => [
      format(new Date(v.verkocht_op), 'dd-MM-yyyy HH:mm'),
      v.onderdeel?.naam || 'Onbekend product',
      v.aantal.toString(),
      `€ ${v.stuk_prijs.toFixed(2)}`,
      `€ ${v.totaal_prijs.toFixed(2)}`,
      v.klant_naam || '-',
      v.betaalmethode
    ])

    autoTable(this.doc, {
      startY: yPos + 40,
      head: [['Datum', 'Product', 'Aantal', 'Prijs/stuk', 'Totaal', 'Klant', 'Betaling']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    // Legal footer
    const finalY = (this.doc as any).lastAutoTable.finalY + 20
    this.doc.setFontSize(8)
    this.doc.setTextColor(100)
    this.doc.text('Dit document is automatisch gegenereerd en rechtsgeldig zonder handtekening.', 20, finalY)
    this.doc.text('Bewaar dit document voor uw administratie.', 20, finalY + 5)
    
    this.addFooter(1)
    
    return this.doc.output('blob')
  }

  generateVoorraadRapport(onderdelen: Onderdeel[]): Blob {
    this.doc = new jsPDF()
    
    this.addHeader(
      'Voorraad Waardering',
      `Actuele voorraadstatus per ${format(new Date(), 'dd MMMM yyyy', { locale: nl })}`
    )

    // Calculate totals
    const totaalWaarde = onderdelen.reduce((sum, o) => sum + (o.voorraad * o.verkoop_prijs), 0)
    const totaalInkoop = onderdelen.reduce((sum, o) => sum + (o.voorraad * o.inkoop_prijs), 0)
    const lageVoorraad = onderdelen.filter(o => o.voorraad <= o.min_voorraad).length
    const uitVoorraad = onderdelen.filter(o => o.voorraad === 0).length

    // Summary
    let yPos = 70
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(20, yPos, 170, 40, 'F')
    
    this.doc.setFontSize(10)
    this.doc.text(`Totaal artikelen: ${onderdelen.length}`, 30, yPos + 10)
    this.doc.text(`Voorraad waarde (verkoop): € ${totaalWaarde.toFixed(2)}`, 30, yPos + 20)
    this.doc.text(`Voorraad waarde (inkoop): € ${totaalInkoop.toFixed(2)}`, 30, yPos + 30)
    this.doc.text(`Uit voorraad: ${uitVoorraad}`, 120, yPos + 10)
    this.doc.text(`Lage voorraad: ${lageVoorraad}`, 120, yPos + 20)
    this.doc.text(`Potentiële winst: € ${(totaalWaarde - totaalInkoop).toFixed(2)}`, 120, yPos + 30)

    // Inventory table
    const tableData = onderdelen.map(o => [
      o.sku,
      o.naam,
      o.voorraad.toString(),
      o.min_voorraad.toString(),
      `€ ${o.inkoop_prijs.toFixed(2)}`,
      `€ ${o.verkoop_prijs.toFixed(2)}`,
      `€ ${(o.voorraad * o.verkoop_prijs).toFixed(2)}`,
      o.locatie || '-',
      o.voorraad === 0 ? 'UIT VOORRAAD' : 
      o.voorraad <= o.min_voorraad ? 'LAAG' : 'OK'
    ])

    autoTable(this.doc, {
      startY: yPos + 50,
      head: [['SKU', 'Product', 'Voorraad', 'Min', 'Inkoop', 'Verkoop', 'Waarde', 'Locatie', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didParseCell: (data: any) => {
        // Color code status column
        if (data.column.index === 8 && data.cell.section === 'body') {
          if (data.cell.text[0] === 'UIT VOORRAAD') {
            data.cell.styles.textColor = [220, 38, 38]
            data.cell.styles.fontStyle = 'bold'
          } else if (data.cell.text[0] === 'LAAG') {
            data.cell.styles.textColor = [245, 158, 11]
            data.cell.styles.fontStyle = 'bold'
          } else {
            data.cell.styles.textColor = [34, 197, 94]
          }
        }
      },
    })

    this.addFooter(1)
    return this.doc.output('blob')
  }

  generateWinstVerliesRapport(
    verkopen: Verkoop[],
    periode: string
  ): Blob {
    this.doc = new jsPDF()
    
    this.addHeader(
      'Winst & Verlies Rapport',
      `Financieel overzicht - ${periode}`
    )

    // Calculate financial metrics
    const omzet = verkopen.reduce((sum, v) => sum + v.totaal_prijs, 0)
    const kosten = verkopen.reduce((sum, v) => sum + (v.aantal * (v.inkoop_prijs || 0)), 0)
    const brutoWinst = omzet - kosten
    const winstmarge = omzet > 0 ? (brutoWinst / omzet) * 100 : 0

    // Financial overview
    let yPos = 70
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(20, yPos, 170, 50, 'F')
    
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Financieel Overzicht', 30, yPos + 10)
    
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.doc.text(`Totale omzet:`, 30, yPos + 20)
    this.doc.text(`€ ${omzet.toFixed(2)}`, 150, yPos + 20, { align: 'right' })
    
    this.doc.text(`Inkoopkosten:`, 30, yPos + 30)
    this.doc.text(`- € ${kosten.toFixed(2)}`, 150, yPos + 30, { align: 'right' })
    
    this.doc.setDrawColor(150)
    this.doc.line(30, yPos + 35, 160, yPos + 35)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Bruto winst:`, 30, yPos + 43)
    this.doc.text(`€ ${brutoWinst.toFixed(2)}`, 150, yPos + 43, { align: 'right' })
    
    // Margin indicator
    this.doc.setFillColor(59, 130, 246)
    this.doc.rect(20, yPos + 60, 170, 20, 'F')
    this.doc.setTextColor(255)
    this.doc.setFontSize(12)
    this.doc.text(`Winstmarge: ${winstmarge.toFixed(1)}%`, 105, yPos + 72, { align: 'center' })
    
    this.doc.setTextColor(0)
    this.addFooter(1)
    
    return this.doc.output('blob')
  }

  generateDodeVoorraadRapport(onderdelen: Onderdeel[]): Blob {
    this.doc = new jsPDF()
    
    this.addHeader(
      'Dode Voorraad Analyse',
      'Producten zonder recente verkopen'
    )

    const daysThreshold = 90 // Items not sold in 90 days
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold)

    const dodeVoorraad = onderdelen.filter(o => {
      if (!o.laatste_verkoop) return true
      return new Date(o.laatste_verkoop) < thresholdDate
    })

    const totaalWaarde = dodeVoorraad.reduce((sum, o) => sum + (o.voorraad * o.verkoop_prijs), 0)

    // Summary
    let yPos = 70
    this.doc.setFillColor(255, 243, 224)
    this.doc.rect(20, yPos, 170, 30, 'F')
    
    this.doc.setFontSize(10)
    this.doc.text(`Producten zonder verkoop (${daysThreshold} dagen): ${dodeVoorraad.length}`, 30, yPos + 10)
    this.doc.text(`Totale waarde vastgelegd: € ${totaalWaarde.toFixed(2)}`, 30, yPos + 20)

    // Dead stock table
    const tableData = dodeVoorraad.map(o => [
      o.sku,
      o.naam,
      o.voorraad.toString(),
      `€ ${o.verkoop_prijs.toFixed(2)}`,
      `€ ${(o.voorraad * o.verkoop_prijs).toFixed(2)}`,
      o.laatste_verkoop 
        ? format(new Date(o.laatste_verkoop), 'dd-MM-yyyy')
        : 'Nooit verkocht',
      o.locatie || '-'
    ])

    autoTable(this.doc, {
      startY: yPos + 40,
      head: [['SKU', 'Product', 'Voorraad', 'Prijs', 'Waarde', 'Laatste verkoop', 'Locatie']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [245, 158, 11],
        textColor: 255,
      },
    })

    this.addFooter(1)
    return this.doc.output('blob')
  }
}