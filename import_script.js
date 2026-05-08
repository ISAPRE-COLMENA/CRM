const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];
fs.createReadStream('apollo-contacts-export (1).csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Parsed ${results.length} rows.`);
    
    const toInsert = results.map(row => {
      const apolloId = row['Apollo Contact Id'] || Math.random().toString(36).substring(7);
      const rut = `APL-${apolloId}`; 
      
      return {
        rut: rut,
        nombre: row['First Name'] || 'Desconocido',
        apellido: row['Last Name'] || '',
        email: row['Email'] || null,
        telefono: row['Mobile Phone'] || row['Work Direct Phone'] || row['Corporate Phone'] || null,
        stage: 'nuevo'
      };
    });

    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < toInsert.length; i += 50) {
      const batch = toInsert.slice(i, i + 50);
      const { data, error } = await supabase.from('leads').upsert(batch, { onConflict: 'rut', ignoreDuplicates: true }).select('id');
      if (error) {
        console.error("Error inserting batch:", error.message);
        errors += batch.length;
      } else {
        inserted += data?.length || 0;
      }
    }

    console.log(`Successfully inserted: ${inserted}`);
    console.log(`Errors: ${errors}`);
  });
