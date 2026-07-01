import os
import glob
import re

def update_nav(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define what we're looking for and what we want to insert.
    # We want to insert `<li><a href="accommodation.html" class="nav-link">Accommodation</a></li>`
    # right after the About Us link.
    
    # We have to handle `nav-link active` potentially being on About Us, or other links.
    # Pattern to match the About Us list item in nav
    pattern = r'(<li><a href="about\.html"[^>]*>About Us</a></li>)'
    
    if "accommodation.html" in content and filepath.endswith("accommodation.html") == False:
        # Already updated (or partially)
        # Check if it's just the footer or also the main nav.
        pass
    
    # Replacement string
    replacement = r'\1\n        <li><a href="accommodation.html" class="nav-link">Accommodation</a></li>'
    
    # Also update footer quick links
    # Pattern to match About Us in footer quick links
    footer_pattern = r'(<li><a href="about\.html">About Us</a></li>)'
    footer_replacement = r'\1\n            <li><a href="accommodation.html">Accommodation</a></li>'

    new_content = re.sub(pattern, replacement, content)
    new_content = re.sub(footer_pattern, footer_replacement, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

html_files = glob.glob('*.html')
for file in html_files:
    if file != 'accommodation.html': # Don't update the one we just created since it already has it
        update_nav(file)
