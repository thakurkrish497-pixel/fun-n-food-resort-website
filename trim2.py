import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

items = re.findall(r'<div class="carousel-item item-\d+">.*?</div>', html, re.DOTALL)
if items:
    for item in items:
        html = html.replace(item, '')
    
    new_html = '\n        '.join(items[:12])
    html = html.replace('<div class="carousel">', '<div class="carousel">\n        ' + new_html)
    
    html = re.sub(r'\n\s*\n\s*\n', '\n\n', html)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Trimmed HTML successfully to 12 items')
