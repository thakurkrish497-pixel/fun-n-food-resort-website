import os
from PIL import Image

def compress_image(path, max_width=800):
    try:
        img = Image.open(path)
        
        # Calculate new height keeping aspect ratio
        if img.width > max_width:
            wpercent = (max_width / float(img.width))
            hsize = int((float(img.height) * float(wpercent)))
            img = img.resize((max_width, hsize), Image.Resampling.LANCZOS)
            
        # Convert to RGB if necessary
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        img.save(path, "JPEG", optimize=True, quality=60)
        return True
    except Exception as e:
        print(f"Failed to compress {path}: {e}")
        return False

# Compress all huge images in new_photos and facilities
folders = [
    r"c:\Users\Saket\Desktop\fun n food website\assets\images\new_photos",
    r"c:\Users\Saket\Desktop\fun n food website\assets\images\facilities"
]

for folder in folders:
    if os.path.exists(folder):
        for filename in os.listdir(folder):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.avif', '.webp')):
                filepath = os.path.join(folder, filename)
                # Only compress files larger than 500KB
                if os.path.getsize(filepath) > 500 * 1024:
                    print(f"Compressing {filename}...")
                    compress_image(filepath)

print("Compression complete.")
