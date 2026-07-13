import shutil
import os
import re

# 1. Copy the fast food image
src = r"c:\Users\Saket\Downloads\drive-download-20260701T103219Z-3-001\0A9A3830.JPG"
dest = r"c:\Users\Saket\Desktop\fun n food website\assets\images\facilities\fast_food.jpg"

if os.path.exists(src):
    shutil.copy2(src, dest)
    print("Copied fast food image.")
else:
    print(f"Error: Could not find {src}")

# 2. Update script.js
script_path = r"c:\Users\Saket\Desktop\fun n food website\script.js"
with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace the image path for "Fast Food & Snack Counters"
# from "assets/images/restaurant.avif" to "assets/images/facilities/fast_food.jpg"
old_str = '{ title: "Fast Food & Snack Counters", text: "Quick and tasty bites for everyone.", image: "assets/images/restaurant.avif" }'
new_str = '{ title: "Fast Food & Snack Counters", text: "Quick and tasty bites for everyone.", image: "assets/images/facilities/fast_food.jpg" }'

content = content.replace(old_str, new_str)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated script.js with fast food image.")
