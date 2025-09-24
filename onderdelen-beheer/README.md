# Onderdelen Beheer Systeem

Een volledig gratis te hosten voorraadbeheersysteem voor onderdelen. Perfect voor kleine bedrijven en persoonlijk gebruik.

## 🚀 Features

- 📊 **Dashboard** - Real-time statistieken en overzichten
- 📦 **Voorraadbeheer** - Compleet onderdelenbeheer met SKU en barcode support
-  **Rapportages** - Uitgebreide voorraadrapportages en Excel exports
- 📨 **Waarschuwingen** - Automatische meldingen bij lage voorraad
- 📱 **PWA** - Installeerbaar als app op telefoon/tablet
- 🔒 **Authenticatie** - Simpele toegangscode beveiliging
- 🌐 **100% Gratis** - Volledig gratis te hosten op Vercel

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (500MB gratis)
- **Hosting**: Vercel (100GB bandwidth gratis)
- **Afbeeldingen**: Cloudinary (25GB/maand gratis)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## 🏁 Snelstart

### 1. Kloon het project

```bash
git clone https://github.com/yourusername/onderdelen-beheer.git
cd onderdelen-beheer
npm install
```

### 2. Setup Supabase

1. Maak een gratis account aan op [supabase.com](https://supabase.com)
2. Maak een nieuw project aan
3. Voer het SQL schema uit vanuit `lib/supabase/schema.sql`
4. Kopieer je project URL en anon key

### 3. Setup Cloudinary (Optioneel)

1. Maak een gratis account aan op [cloudinary.com](https://cloudinary.com)
2. Stel een unsigned upload preset in
3. Kopieer je cloud name en preset naam

### 4. Environment Variables

Kopieer `.env.local.example` naar `.env.local` en vul in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ACCESS_CODE=jouwGeheimeCode2024
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 5. Start de ontwikkelserver

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment op Vercel

1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com) en login met GitHub
3. Import je repository
4. Voeg de environment variables toe
5. Deploy!

## 📄 Database Schema

Het systeem gebruikt de volgende tabellen:

- **categories** - Product categorieën
- **onderdelen** - Alle onderdelen/producten
- **verkopen** - Verkoop transacties
- **voorraad_logs** - Voorraad wijzigingen historie

## 🎯 Gebruik

### Login

Gebruik de toegangscode die je hebt ingesteld in je environment variables.
Demo code: `demo2024`

### Onderdelen toevoegen

1. Ga naar "Onderdelen" in het menu
2. Klik op "Nieuw Onderdeel"
3. Vul alle velden in
4. SKU wordt automatisch gegenereerd
5. Sla op

### Verkoop registreren

1. Ga naar "Verkoop" in het menu
2. Zoek producten via naam, SKU of barcode
3. Voeg toe aan winkelwagen
4. Selecteer betaalmethode
5. Reken af

### Voorraad beheren

1. Ga naar "Voorraad" in het menu
2. Bekijk waarschuwingen voor lage voorraad
3. Pas voorraad aan indien nodig
4. Systeem houdt automatisch historie bij

## 💰 Kostenberekening

**Volledig GRATIS voor:**
- Tot 500MB database (Supabase)
- Tot 100GB bandwidth/maand (Vercel)
- Tot 25GB afbeeldingen/maand (Cloudinary)
- Onbeperkte gebruikers op één account

**Perfect voor:**
- Kleine bedrijven
- Eenmanszaken
- Hobby projecten
- Tot ~5000 producten
- Tot ~1000 verkopen/maand

## 🤝 Support

Voor vragen of problemen, open een issue op GitHub.

## 📄 Licentie

MIT License - Vrij te gebruiken voor commerciële doeleinden.

---

Gemaakt met ❤️ voor de Nederlandse MKB