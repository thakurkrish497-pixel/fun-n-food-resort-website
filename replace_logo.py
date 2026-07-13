import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Navbar Logo
    content = re.sub(
        r'<div class="logo">Fun N Food</div>',
        r'<div class="logo" style="display: flex; align-items: center;"><img src="assets/images/logo.jpeg" alt="Fun N Food Logo" style="height: 50px; width: auto;"></div>',
        content
    )

    # 2. Hero Section (index.html)
    content = re.sub(
        r'<h1 class="blackletter-title" style="font-size: 5rem; margin-bottom: 10px;">Fun N Food</h1>\s*<p class="subtitle" style="font-size: 1\.2rem; letter-spacing: 2px;">Resort & Water Park</p>',
        r'<img src="assets/images/logo.jpeg" alt="Fun N Food Resort Logo" style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));">',
        content
    )
    
    # Hero section might be slightly different?
    # Let's also do a looser match for the index hero just in case
    content = re.sub(
        r'<h1 class="blackletter-title"[^>]*>Fun N Food</h1>\s*<p class="subtitle"[^>]*>Resort & Water Park</p>',
        r'<img src="assets/images/logo.jpeg" alt="Fun N Food Resort Logo" style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));">',
        content
    )

    # 3. Footer Title
    content = re.sub(
        r'<h3>About Fun N Food</h3>',
        r'<img src="assets/images/logo.jpeg" alt="Fun N Food Logo" style="height: 40px; margin-bottom: 15px;">',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")
