import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req:Request) {
  try {
    const{lead_id,lat,lng}=await req.json();
    if(!lead_id||lat==null||lng==null) return NextResponse.json({error:'lead_id, lat y lng requeridos'},{status:400});
    const{data,error}=await sb.rpc('update_lead_location',{p_lead_id:lead_id,p_lat:lat,p_lng:lng});
    if(error)throw error;
    return NextResponse.json(data);
  } catch(err:any){return NextResponse.json({error:err.message},{status:500});}
}