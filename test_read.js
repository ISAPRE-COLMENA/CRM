const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching leads from:', supabaseUrl);
  const { data, error } = await supabase.from('leads').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log(`Found ${data.length} leads.`);
    if (data.length > 0) {
      console.log('First lead:', data[0].nombre, data[0].apellido);
    }
  }
}

test();
