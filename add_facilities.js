const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('website_data').select('content').eq('id', 1).single();
  if (error) {
    console.error(error);
    return;
  }
  
  const content = data.content;
  
  const newFacilities = [
    { title: "Wedding & Banquet Halls", text: "Luxurious spaces for your special day.", image: "assets/images/events.jpg" },
    { title: "Private Parties", text: "Exclusive venues for private celebrations.", image: "assets/images/events.jpg" },
    { title: "In-Room Dining", text: "Enjoy delicious meals in the comfort of your room.", image: "assets/images/restaurant.avif" },
    { title: "Fast Food & Snack Counters", text: "Quick and tasty bites for everyone.", image: "assets/images/restaurant.avif" },
    { title: "Rain Dance", text: "High-energy rain dance area to let loose.", image: "assets/images/activities.avif" },
    { title: "Bar", text: "Relax with your favorite drinks and cocktails.", image: "assets/images/restaurant.avif" },
    { title: "Water Pool & Slides", text: "Thrilling water rides and pristine swimming pools.", image: "assets/images/pool.jpg" },
    { title: "Private Room Pool", text: "Exclusive pool access for select accommodations.", image: "assets/images/pool.jpg" },
    { title: "Ample Parking", text: "Spacious and secure parking for all guests.", image: "assets/images/activities.avif" },
    { title: "Kids Play Area", text: "Indoor & outdoor fun zones for children.", image: "assets/images/activities.avif" }
  ];

  // Append new facilities to existing ones
  content.facilities.items = [
    ...content.facilities.items,
    ...newFacilities
  ];

  const { error: updateError } = await supabase
    .from('website_data')
    .update({ content: content })
    .eq('id', 1);

  if (updateError) {
    console.error("Failed to update:", updateError);
  } else {
    console.log("Successfully added new facilities!");
  }
}

run();
