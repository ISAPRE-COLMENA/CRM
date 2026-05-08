const fs = require('fs');
const csv = require('csv-parser');

const results = [];
fs.createReadStream('apollo-contacts-export (1).csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Parsed ${results.length} rows.`);
    
    const toInsert = results.map(row => {
      // Use Apollo Contact Id as rut
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
      try {
        const res = await fetch('https://crm-colmena.vercel.app/api/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ batch })
        });
        const json = await res.json();
        
        if (!res.ok || json.error) {
          console.error("Error inserting batch:", json.error || res.statusText);
          errors += batch.length;
        } else {
          inserted += json.data?.length || batch.length;
        }
      } catch (e) {
        console.error("Fetch error:", e.message);
        errors += batch.length;
      }
    }

    console.log(`Successfully inserted via Vercel API: ${inserted}`);
    console.log(`Errors: ${errors}`);
  });
