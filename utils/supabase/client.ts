import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jklwyynvovhrkkxsvuyf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L5CIZwuQ33zVXNHPng0yKA_EyNVYrYB';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
