import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Change duration
content = content.replace("duration: 30,", "duration: 10,")

# Replace document.getElementById('...').textContent = ...
# with const el = document.getElementById('...'); if (el) el.textContent = ...;
# We will just write a helper function at the top of the .then block and use it.

helper = """      // Helper to safely set elements
      const setEl = (id, val, type='text') => {
        const el = document.getElementById(id);
        if (el) {
          if (type === 'html') el.innerHTML = val;
          else if (type === 'src') el.src = val;
          else el.textContent = val;
        }
      };
      
      const formatText = (text) => text ? text.replace(/\\n\\n/g, '<br><br>') : '';"""

content = content.replace("      // Helper to preserve line breaks\n      const formatText = (text) => text ? text.replace(/\\n\\n/g, '<br><br>') : '';", helper)

# Now regex replace
# document.getElementById('hero-title').textContent = data.hero.title;
# -> setEl('hero-title', data.hero.title, 'text');

content = re.sub(
    r"document\.getElementById\('([^']+)'\)\.textContent\s*=\s*(.+?);",
    r"setEl('\1', \2, 'text');",
    content
)

content = re.sub(
    r"document\.getElementById\('([^']+)'\)\.innerHTML\s*=\s*(.+?);",
    r"setEl('\1', \2, 'html');",
    content
)

content = re.sub(
    r"document\.getElementById\('([^']+)'\)\.src\s*=\s*(.+?);",
    r"setEl('\1', \2, 'src');",
    content
)

# Fix special case: if (hTitle && hTitle.classList.contains('large-title') === false) hTitle.textContent = data.hero.title;
# I will manually fix the hero-title if it was replaced wrongly.

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed script.js")
