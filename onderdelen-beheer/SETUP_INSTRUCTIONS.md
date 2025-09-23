# 🚀 Setup Instructies voor Supabase

## Stap 1: Kopieer het Database Schema

1. Ga naar je Supabase dashboard: https://supabase.com/dashboard/project/gotregzapdeasovluoeb
2. Klik op **SQL Editor** in de linker sidebar
3. Klik op **New query**
4. Kopieer de VOLLEDIGE inhoud van `lib/supabase/schema.sql`
5. Plak het in de SQL editor
6. Klik op **Run** (groene knop)

## Stap 2: Haal je API Keys op

1. Ga naar **Settings** (tandwiel icoon)
2. Klik op **API** in het menu
3. Kopieer deze twee keys:
   - **Project URL**: `https://gotregzapdeasovluoeb.supabase.co`
   - **anon public key**: (de lange string onder "Project API keys")

## Stap 3: Update .env.local

Open `.env.local` en vul in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gotregzapdeasovluoeb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[plak hier je anon key]
ACCESS_CODE=demo2024
```

## Stap 4: Test de applicatie

```bash
npm run dev
```

Open http://localhost:3000 en login met code: `demo2024`

## 🔧 Troubleshooting

### Als je een foutmelding krijgt:

1. **"relation does not exist"**: 
   - Het SQL schema is niet uitgevoerd. Ga terug naar stap 1.

2. **"Invalid API key"**:
   - Check of je de juiste anon key hebt gekopieerd (niet de service_role key!)

3. **RLS policy errors**:
   - Ga naar Supabase dashboard → Authentication → Policies
   - Check of RLS is enabled voor alle tabellen

## 📝 Belangrijk

- De database URL die je hebt is: `postgresql://postgres:[YOUR-PASSWORD]@db.gotregzapdeasovluoeb.supabase.co:5432/postgres`
- Voor de Next.js app gebruik je de HTTPS URL: `https://gotregzapdeasovluoeb.supabase.co`
- Bewaar je keys veilig en deel ze nooit publiekelijk!