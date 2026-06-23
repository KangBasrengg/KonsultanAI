import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function addCategories() {
  const newCats = [
    { id: 'c5000000-0000-0000-0000-000000000005', name: 'Hukum Perjanjian', description: 'Panduan lengkap tentang jenis-jenis perjanjian, syarat sah, dan teknik drafting kontrak yang kuat.' },
    { id: 'c6000000-0000-0000-0000-000000000006', name: 'Hukum Pajak', description: 'Strategi kepatuhan pajak, perencanaan pajak legal, dan pemahaman sengketa pajak.' },
    { id: 'c7000000-0000-0000-0000-000000000007', name: 'Hukum Ketenagakerjaan', description: 'Hak dan kewajiban pekerja, PHK, pesangon, hubungan industrial, dan penyelesaian perselisihan.' },
  ];

  for (const cat of newCats) {
    const { error } = await supabase.from('legal_categories').upsert(cat, { onConflict: 'id' });
    if (error) console.error('Error:', cat.name, error.message);
    else console.log('Category OK:', cat.name);
  }
}

addCategories();
