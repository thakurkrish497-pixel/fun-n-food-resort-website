import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Define the new injection block
new_injection = """
      // --- INJECT ADDITIONAL FACILITIES & FIX IMAGES ---
      if (data && data.facilities && data.facilities.items) {
        // 1. Remove "Thrilling Water Park"
        data.facilities.items = data.facilities.items.filter(f => f.title !== 'Thrilling Water Park');

        // 2. Fix images for existing DB items
        const deluxe = data.facilities.items.find(f => f.title === 'Deluxe Resort Rooms');
        if (deluxe) deluxe.image = 'assets/images/facilities/deluxe_rooms.jpg';

        const sports = data.facilities.items.find(f => f.title === 'Sports & Indoor Games');
        if (sports) sports.image = 'assets/images/facilities/sports.jpg';

        // 3. Inject all the extra facilities with specific images
        const extraFacilities = [
          { title: "Wedding & Banquet Halls", text: "Luxurious spaces for your special day.", image: "assets/images/facilities/wedding.jpg" },
          { title: "Private Parties", text: "Exclusive venues for private celebrations.", image: "assets/images/facilities/private_parties.jpg" },
          { title: "In-Room Dining", text: "Enjoy delicious meals in the comfort of your room.", image: "assets/images/facilities/in_room_dining.jpg" },
          { title: "Fast Food & Snack Counters", text: "Quick and tasty bites for everyone.", image: "assets/images/restaurant.avif" },
          { title: "Rain Dance", text: "High-energy rain dance area to let loose.", image: "assets/images/activities.avif" },
          { title: "Bar", text: "Relax with your favorite drinks and cocktails.", image: "assets/images/restaurant.avif" },
          { title: "Water Pool & Slides", text: "Thrilling water rides and pristine swimming pools.", image: "assets/images/facilities/water_pool.jpg" },
          { title: "Private Room Pool", text: "Exclusive pool access for select accommodations.", image: "assets/images/facilities/private_room_pool.jpg" },
          { title: "Ample Parking", text: "Spacious and secure parking for all guests.", image: "assets/images/facilities/parking.jpg" },
          { title: "Kids Play Area", text: "Indoor & outdoor fun zones for children.", image: "assets/images/facilities/kids_play_area.jpg" }
        ];

        // Only add if not already added to prevent duplicates on hot reloads
        if (!data.facilities.items.find(f => f.title === "Wedding & Banquet Halls")) {
          data.facilities.items.push(...extraFacilities);
        }
      }
      // -------------------------------------------------
"""

# Find the old injection block and replace it
# The old block started with "// --- INJECT ADDITIONAL FACILITIES ---" and ended before "const path ="
pattern = r"// --- INJECT ADDITIONAL FACILITIES ---.*?(?=\s*const path = window\.location\.pathname;)"
new_content = re.sub(pattern, new_injection.strip(), content, flags=re.DOTALL)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated script.js with new images and removed water park!")
