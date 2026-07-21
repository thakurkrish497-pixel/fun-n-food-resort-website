import re

# 1. Update script.js GSAP physics
with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace('duration: 10,', 'duration: 7,')
js = js.replace('ease: "linear",', 'ease: "none",')
js = js.replace("gsap.to('.carousel', { opacity: 1, duration: 1.5 });", "gsap.to('.carousel', { opacity: 1, duration: 2.5, ease: 'power2.inOut' });")
js = js.replace('scale: 1.5, // Less extreme scaling', 'scale: 1.2, // Improved elegant scaling')
js = js.replace('duration: 1.5, // Majestic, smooth explosion', 'duration: 2.5, // Majestic, smooth explosion')
js = js.replace('ease: "power2.out" // Start fast', 'ease: "expo.out" // Start fast')

with open("script.js", "w", encoding="utf-8") as f:
    f.write(js)

# 2. Remove conflicting old CSS rules from style.css
with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Remove all .carousel-item:nth-child(...) blocks
pattern = r"\.carousel-item:nth-child\(\d+\)\s*\{[^}]+\}"
css = re.sub(pattern, "", css)

with open("style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated GSAP physics and removed conflicting CSS.")
