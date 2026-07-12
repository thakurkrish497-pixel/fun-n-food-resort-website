const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('website_data').select('*').eq('id', 1).single();
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Last updated at:', data.updated_at);
    console.log('Hero BG Image:', data.content.hero.bgImage);
  }
}
check();
