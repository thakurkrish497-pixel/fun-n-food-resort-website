import shutil
import os

# Move and rename the image the user just downloaded
src = r"c:\Users\Saket\Desktop\fun n food website\assets\images\images.jpg"
dest = r"c:\Users\Saket\Desktop\fun n food website\assets\images\facilities\bar.jpg"

if os.path.exists(src):
    shutil.move(src, dest)
    print("Moved bar image successfully.")
else:
    print(f"Error: Could not find {src}")

# Update script.js
script_path = r"c:\Users\Saket\Desktop\fun n food website\script.js"
with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

old_str = '{ title: "Bar", text: "Relax with your favorite drinks and cocktails.", image: "assets/images/restaurant.avif" }'
new_str = '{ title: "Bar", text: "Relax with your favorite drinks and cocktails.", image: "assets/images/facilities/bar.jpg" }'

content = content.replace(old_str, new_str)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated script.js with new bar image.")
