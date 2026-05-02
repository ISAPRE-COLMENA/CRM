import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { createClient } from '@supabase/supabase-js';

// Cliente para el navegador (usando la clave anónima pública)
export const supabase = createBrowserClient();

// Cliente administrativo (solo para el servidor)
// Evitamos que explote en el navegador si la clave secreta no está presente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jklwyynvovhrkkxsvuyf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = (typeof window === 'undefined' && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;