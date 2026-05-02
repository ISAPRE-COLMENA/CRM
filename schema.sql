-- ============================================================
--  CRM COLMENA · Supabase PostgreSQL Schema
--  Ejecutar en: Supabase → SQL Editor → New Query
-- ============================================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── TABLA LEADS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rut                       TEXT NOT NULL UNIQUE,
  nombre                    TEXT NOT NULL,
  apellido                  TEXT NOT NULL,
  email                     TEXT,
  telefono                  TEXT,
  sueldo_imponible          NUMERIC(12,2),
  isapre_actual             TEXT,
  stage                     TEXT NOT NULL DEFAULT 'nuevo'
                            CHECK (stage IN ('nuevo','contactado','evaluacion','cierre','no_interesado')),
  fecha_firma               DATE,
  -- Vigencia automática: 1er día del mes subsiguiente a la firma
  vigencia_desde            DATE GENERATED ALWAYS AS (
    CASE WHEN fecha_firma IS NOT NULL
      THEN (date_trunc('month', fecha_firma + INTERVAL '2 months'))::DATE
    END
  ) STORED,
  -- Checklist documental
  doc_cedula_identidad      BOOLEAN DEFAULT FALSE,
  doc_liquidacion_sueldo    BOOLEAN DEFAULT FALSE,
  doc_fun3                  BOOLEAN DEFAULT FALSE,
  doc_formulario_afiliacion BOOLEAN DEFAULT FALSE,
  doc_consentimiento        BOOLEAN DEFAULT FALSE,
  -- Geofencing (Geocity)
  lat                       DOUBLE PRECISION,
  lng                       DOUBLE PRECISION,
  geom                      GEOMETRY(Point, 4326),
  agente_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_rut    ON leads(rut);
CREATE INDEX IF NOT EXISTS idx_leads_stage  ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_agente ON leads(agente_id);
CREATE INDEX IF NOT EXISTS idx_leads_geom   ON leads USING GIST(geom);

-- Trigger: sincroniza geom y updated_at al insertar/actualizar
CREATE OR REPLACE FUNCTION sync_lead_geom() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_leads_geom
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION sync_lead_geom();

-- ── TABLA INTERACCIONES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS interacciones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agente_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo         TEXT NOT NULL CHECK (tipo IN ('llamada','videollamada','visita','email','whatsapp','nota')),
  notas        TEXT,
  duracion_min INT,
  sala_jitsi   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_int_lead ON interacciones(lead_id);

-- ── TABLA EVENTOS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID REFERENCES leads(id) ON DELETE SET NULL,
  agente_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  titulo     TEXT NOT NULL,
  tipo       TEXT NOT NULL DEFAULT 'reunion'
             CHECK (tipo IN ('reunion','visita_terreno','videollamada','seguimiento','otro')),
  inicio     TIMESTAMPTZ NOT NULL,
  fin        TIMESTAMPTZ NOT NULL,
  sala_jitsi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ev_agente ON eventos(agente_id);
CREATE INDEX IF NOT EXISTS idx_ev_inicio ON eventos(inicio);

-- ── FUNCIÓN GEOCITY ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_lead_location(
  p_lead_id UUID, p_lat DOUBLE PRECISION, p_lng DOUBLE PRECISION
) RETURNS JSON AS $$
DECLARE v_lead leads;
BEGIN
  UPDATE leads SET lat=p_lat, lng=p_lng WHERE id=p_lead_id RETURNING * INTO v_lead;
  RETURN json_build_object(
    'success', TRUE, 'lead_id', v_lead.id,
    'lat', v_lead.lat, 'lng', v_lead.lng,
    'geom', ST_AsGeoJSON(v_lead.geom)
  );
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agentes_leads"
  ON leads FOR ALL USING (agente_id = auth.uid());
CREATE POLICY "agentes_interacciones"
  ON interacciones FOR ALL USING (agente_id = auth.uid());
CREATE POLICY "agentes_eventos"
  ON eventos FOR ALL USING (agente_id = auth.uid());
