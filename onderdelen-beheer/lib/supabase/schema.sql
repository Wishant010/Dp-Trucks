-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categorieën tabel
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  naam VARCHAR(100) NOT NULL,
  beschrijving TEXT,
  kleur VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Onderdelen tabel
CREATE TABLE onderdelen (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  naam VARCHAR(200) NOT NULL,
  beschrijving TEXT,
  categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Prijzen
  inkoop_prijs DECIMAL(10,2) DEFAULT 0,
  verkoop_prijs DECIMAL(10,2) NOT NULL,
  
  -- Voorraad
  voorraad INTEGER DEFAULT 0,
  min_voorraad INTEGER DEFAULT 5,
  max_voorraad INTEGER DEFAULT 100,
  
  -- Extra info
  locatie VARCHAR(50),
  leverancier VARCHAR(100),
  barcode VARCHAR(100),
  
  -- Afbeeldingen (JSON array van Cloudinary URLs)
  afbeeldingen JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  actief BOOLEAN DEFAULT true,
  laatste_verkoop TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Verkopen tabel
CREATE TABLE verkopen (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  onderdeel_id UUID REFERENCES onderdelen(id) ON DELETE CASCADE,
  
  -- Verkoop details
  aantal INTEGER NOT NULL,
  stuk_prijs DECIMAL(10,2) NOT NULL,
  totaal_prijs DECIMAL(10,2) NOT NULL,
  inkoop_prijs DECIMAL(10,2), -- Voor winstberekening
  
  -- Klant info (optioneel)
  klant_naam VARCHAR(100),
  klant_telefoon VARCHAR(20),
  klant_email VARCHAR(100),
  
  -- Extra
  betaalmethode VARCHAR(20) DEFAULT 'contant',
  notities TEXT,
  
  -- Timestamps
  verkocht_op TIMESTAMP DEFAULT NOW()
);

-- Voorraad geschiedenis
CREATE TABLE voorraad_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  onderdeel_id UUID REFERENCES onderdelen(id) ON DELETE CASCADE,
  oude_voorraad INTEGER,
  nieuwe_voorraad INTEGER,
  verschil INTEGER,
  reden VARCHAR(50), -- 'verkoop', 'inkoop', 'correctie', 'retour'
  notities TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dashboard stats view
CREATE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM onderdelen WHERE actief = true) as totaal_onderdelen,
  (SELECT SUM(voorraad * verkoop_prijs) FROM onderdelen WHERE actief = true) as voorraad_waarde,
  (SELECT COUNT(*) FROM onderdelen WHERE voorraad <= min_voorraad AND actief = true) as lage_voorraad,
  (SELECT COUNT(*) FROM onderdelen WHERE voorraad = 0 AND actief = true) as uit_voorraad,
  (SELECT COUNT(*) FROM verkopen WHERE DATE(verkocht_op) = CURRENT_DATE) as verkopen_vandaag,
  (SELECT COALESCE(SUM(totaal_prijs), 0) FROM verkopen WHERE DATE(verkocht_op) = CURRENT_DATE) as omzet_vandaag,
  (SELECT COALESCE(SUM(totaal_prijs - (aantal * inkoop_prijs)), 0) FROM verkopen WHERE DATE(verkocht_op) = CURRENT_DATE AND inkoop_prijs IS NOT NULL) as winst_vandaag;

-- Triggers voor updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onderdelen_updated_at
  BEFORE UPDATE ON onderdelen
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies (voor single user - simpel)
ALTER TABLE onderdelen ENABLE ROW LEVEL SECURITY;
ALTER TABLE verkopen ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE voorraad_logs ENABLE ROW LEVEL SECURITY;

-- Simpele policy: authenticated users kunnen alles
CREATE POLICY "Enable all for authenticated users" ON onderdelen
  FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON verkopen
  FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON categories
  FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON voorraad_logs
  FOR ALL USING (true);

-- Seed data voor categorieën
INSERT INTO categories (naam, beschrijving, kleur) VALUES
  ('Motor', 'Motoronderdelen en toebehoren', '#EF4444'),
  ('Transmissie', 'Versnellingsbak en aandrijving', '#F59E0B'),
  ('Remsysteem', 'Remmen en remleidingen', '#10B981'),
  ('Elektronica', 'Elektrische componenten', '#3B82F6'),
  ('Carrosserie', 'Body en exterieur onderdelen', '#8B5CF6'),
  ('Interieur', 'Dashboard en stoelen', '#EC4899'),
  ('Onderstel', 'Vering en wielophanging', '#14B8A6'),
  ('Koeling', 'Radiateur en koelsysteem', '#06B6D4'),
  ('Uitlaat', 'Uitlaatsysteem onderdelen', '#6B7280'),
  ('Overig', 'Diverse onderdelen', '#64748B');