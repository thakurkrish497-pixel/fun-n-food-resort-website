const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('website_data').select('content').eq('id', 1).single();
  if (error) console.error(error);
  else {
    const content = data.content;
    console.log("Has dining?", !!content.dining);
    console.log("Has facilities?", !!content.facilities);
    console.log("Has events?", !!content.events);
    console.log("Has brands?", !!content.brands);
    console.log("Has gallery?", !!content.gallery);
    console.log("Has contact?", !!content.contact);
    console.log("Dining Data:", content.dining);
  }
}
check();
