import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const { batch } = await request.json();

    if (!Array.isArray(batch) || batch.length === 0) {
      return NextResponse.json({ error: 'Invalid batch data' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .upsert(batch, { onConflict: 'rut', ignoreDuplicates: true })
      .select('id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
