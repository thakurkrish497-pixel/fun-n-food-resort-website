import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

injection = """
        const data = webData.content;
        
        // --- INJECT ADDITIONAL FACILITIES ---
        if (data && data.facilities && data.facilities.items) {
          const extraFacilities = [
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
          
          // Only push if they don't already exist to prevent duplicates
          if (!data.facilities.items.find(f => f.title === "Wedding & Banquet Halls")) {
            data.facilities.items.push(...extraFacilities);
          }
        }
        // ------------------------------------
"""

content = content.replace("const data = webData.content;", injection)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected extra facilities into script.js")
