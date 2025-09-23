export interface Categorie {
  id: string
  naam: string
  beschrijving?: string
  kleur: string
  created_at: string
}

export interface Onderdeel {
  id: string
  sku: string
  naam: string
  beschrijving?: string
  categorie_id?: string
  categorie?: Categorie
  inkoop_prijs: number
  verkoop_prijs: number
  voorraad: number
  min_voorraad: number
  max_voorraad?: number
  locatie?: string
  leverancier?: string
  barcode?: string
  afbeeldingen: string[]
  actief: boolean
  laatste_verkoop?: string
  created_at: string
  updated_at: string
}

export interface Verkoop {
  id: string
  onderdeel_id: string
  onderdeel?: Onderdeel
  aantal: number
  stuk_prijs: number
  totaal_prijs: number
  inkoop_prijs?: number
  klant_naam?: string
  klant_telefoon?: string
  klant_email?: string
  betaalmethode: 'contant' | 'pin' | 'overschrijving'
  notities?: string
  verkocht_op: string
}

export interface VoorraadLog {
  id: string
  onderdeel_id: string
  oude_voorraad: number
  nieuwe_voorraad: number
  verschil: number
  reden: 'verkoop' | 'inkoop' | 'correctie' | 'retour'
  notities?: string
  created_at: string
}

export interface DashboardStats {
  totaal_onderdelen: number
  voorraad_waarde: number
  lage_voorraad: number
  uit_voorraad: number
  verkopen_vandaag: number
  omzet_vandaag: number
  winst_vandaag: number
}

export interface User {
  id: string
  email?: string
  authenticated: boolean
}