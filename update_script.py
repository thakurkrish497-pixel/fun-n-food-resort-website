import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Radius
content = re.sub(
    r'const radius = 450;',
    r'const radius = window.innerWidth < 768 ? window.innerWidth / 2.2 : 450;',
    content
)

# 2. Update Explosion Distance
content = re.sub(
    r'x: Math\.sin\(angle\) \* 1500,',
    r'x: Math.sin(angle) * (window.innerWidth < 768 ? window.innerWidth * 1.2 : 1500),',
    content
)
content = re.sub(
    r'y: -Math\.cos\(angle\) \* 1500 \+ 80,',
    r'y: -Math.cos(angle) * (window.innerWidth < 768 ? window.innerWidth * 1.2 : 1500) + 80,',
    content
)

# 3. Add Mobile Menu Toggle logic at the end
mobile_logic = """
// Mobile Menu Toggle Logic
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}
"""

if "Mobile Menu Toggle Logic" not in content:
    content += "\n" + mobile_logic

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated script.js")
