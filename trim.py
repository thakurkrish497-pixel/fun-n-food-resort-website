import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all carousel items
items = re.findall(r'<div class="carousel-item item-\d+">.*?</div>', html, re.DOTALL)
print(f'Found {len(items)} items')

# Keep only 12 items
new_items = items[:12]

# Replace the giant block of items with the new 12 items
match = re.search(r'(<div class="carousel">\s*)(<div class="carousel-item item-1">.*?</div>)(\s*</div>\s*</div>\s*<!-- Carousel bottom overlay -->)', html, re.DOTALL)
if match:
    new_html = match.group(1) + '\n        '.join(new_items) + match.group(3)
    html = html.replace(match.group(0), new_html)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Reduced carousel items to 12')
else:
    print('Could not find carousel block')

# Now update style.css for 12 items instead of 32
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(r'\.carousel-item:nth-child\(\d+\) \{.*?\}', '', css, flags=re.DOTALL)

# Generate CSS for 12 items
new_css = ""
for i in range(1, 13):
    rot = (i - 1) * (360 / 12)
    delay = (i - 1) * (60 / 12)
    new_css += f'''
.carousel-item:nth-child({i}) {{
  transform: rotateY({rot}deg) translateZ(400px) rotateY(90deg);
  animation-delay: -{delay}s;
}}
'''

css = css.replace('.item-content {', new_css + '\n.item-content {')

if 'will-change: transform' not in css:
    css = css.replace('.carousel {', '.carousel {\n  will-change: transform;\n')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated style.css for 12 items')
