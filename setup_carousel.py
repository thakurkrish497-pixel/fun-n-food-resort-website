import os
import shutil
import re
from PIL import Image

def compress_image(path, max_width=800):
    try:
        img = Image.open(path)
        if img.width > max_width:
            wpercent = (max_width / float(img.width))
            hsize = int((float(img.height) * float(wpercent)))
            img = img.resize((max_width, hsize), Image.Resampling.LANCZOS)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(path, "JPEG", optimize=True, quality=60)
    except Exception as e:
        print(f"Failed to compress {path}: {e}")

# 1. Create carousel directory
carousel_dir = r"c:\Users\Saket\Desktop\fun n food website\assets\images\carousel"
os.makedirs(carousel_dir, exist_ok=True)

# 2. The 8 images from the user's downloads folder
src_images = [
    r"c:\Users\Saket\Downloads\fun and food phtos 2\IMG_3211.JPG.jpeg",
    r"c:\Users\Saket\Downloads\fun and food phtos 2\IMG_3210.JPG.jpeg",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3740.JPG",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103219Z-3-001\0A9A3817.JPG",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103219Z-3-001\0A9A3822.JPG",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103219Z-3-001\0A9A3830.JPG",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3778.JPG",
    r"c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3796.JPG"
]

dest_images = []
for i, src in enumerate(src_images):
    dest = os.path.join(carousel_dir, f"{i+1}.jpg")
    dest_images.append(f"assets/images/carousel/{i+1}.jpg")
    if os.path.exists(src):
        shutil.copy2(src, dest)
        compress_image(dest)
        print(f"Copied and compressed {i+1}.jpg")
    else:
        print(f"Warning: {src} not found!")

# 3. Update index.html
index_path = r"c:\Users\Saket\Desktop\fun n food website\index.html"
with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the entire <div class="carousel"> block
carousel_html = '<div class="carousel">\n'
for i, dest_img in enumerate(dest_images):
    carousel_html += f'          <div class="carousel-item item-{i+1}"><img src="{dest_img}" alt=""></div>\n'
carousel_html += '        </div>'

# Regex to find and replace the carousel div and all its children
pattern = r'<div class="carousel">.*?</div>\s*</div>'
content = re.sub(pattern, carousel_html, content, flags=re.DOTALL)

# Also update the inline images to use the first three
content = re.sub(
    r'<span class="inline-img-box img-1"><img src="[^"]+"></span>',
    f'<span class="inline-img-box img-1"><img src="{dest_images[0]}"></span>',
    content
)
content = re.sub(
    r'<span class="inline-img-box img-2"><img src="[^"]+"></span>',
    f'<span class="inline-img-box img-2"><img src="{dest_images[1]}"></span>',
    content
)
content = re.sub(
    r'<img src="[^"]+" alt="Expanding Center">',
    f'<img src="{dest_images[2]}" alt="Expanding Center">',
    content
)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html to use the 8 fast carousel images.")
