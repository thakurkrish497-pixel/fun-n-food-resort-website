const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('website_data').select('content').eq('id', 1).single();
  if (error) console.error(error);
  else {
    const facilities = data.content.facilities.items;
    console.log(`Total facilities in DB: ${facilities.length}`);
    facilities.forEach((f, i) => {
        console.log(`[${i}] ${f.title}`);
    });
  }
}
check();
