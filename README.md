# CRM Colmena 🏥

> MVP Full-Stack para agentes de Isapre Colmena — Open Source

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 App Router + TypeScript |
| Estilos | Tailwind CSS |
| Backend/BD | Supabase (PostgreSQL + Auth + RLS + Realtime) |
| Videoconferencia | Jitsi Meet `@jitsi/react-sdk` |
| Calendario | FullCalendar `@fullcalendar/react` |
| Iconos | Lucide React |
| Geofencing | PostGIS + endpoint `/api/geocity` |

---

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.local.example .env.local
# → Edita con tus credenciales de Supabase

# 3. Ejecutar schema.sql en Supabase → SQL Editor

# 4. Correr en desarrollo
npm run dev
# → http://localhost:3000

# 5. Build producción
npm run build
```

---

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Features

| Feature | Estado |
|---------|--------|
| Kanban Drag & Drop 5 etapas + colores | ✅ |
| Realtime multi-agente (Supabase) | ✅ |
| Videollamada Jitsi incrustada + notas + timer | ✅ |
| Importador CSV — dedup por RUT | ✅ |
| Checklist documental (FUN3 obligatorio) | ✅ |
| Vigencia automática (columna GENERATED) | ✅ |
| Login Supabase Auth | ✅ |
| KPIs en dashboard | ✅ |
| Calendario FullCalendar | ✅ |
| Endpoint Geocity POST /api/geocity | ✅ |
| RLS por agente | ✅ |

---

## Endpoint Geocity

```http
POST /api/geocity
Content-Type: application/json

{ "lead_id": "uuid", "lat": -41.46, "lng": -72.94 }
```

---

## Lógica Isapre

- **Vigencia**: columna `GENERATED ALWAYS` — 1er día del mes subsiguiente a la firma
- **FUN3 obligatorio**: validación en `LeadModal.tsx` bloquea cambio a `cierre` sin FUN3
- **RUT único**: `UNIQUE` en BD + `ignoreDuplicates` en upsert CSV

---

## Deploy en Vercel

```bash
vercel --prod
# Agregar las mismas variables de entorno en el dashboard de Vercel
```

MIT License
