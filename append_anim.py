import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

animation_code = """
      // --- Universal Subpage GSAP Animations ---
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
          gsap.registerPlugin(ScrollTrigger);

          // 1. Universal Title & Text Reveal
          gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
              scrollTrigger: { trigger: title, start: "top 85%" },
              y: 50, opacity: 0, duration: 0.8, ease: "power2.out"
            });
          });
          gsap.utils.toArray('.section-text').forEach(text => {
            gsap.from(text, {
              scrollTrigger: { trigger: text, start: "top 85%" },
              y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out"
            });
          });

          // 2. Staggered Grid Cards
          const grids = ['.grid', '.footer-grid', '#gallery-container'];
          grids.forEach(gridClass => {
            gsap.utils.toArray(gridClass).forEach(grid => {
              const items = grid.querySelectorAll('.facility-card, .room-card, .gallery-img, .brand-card, .footer-col');
              if (items.length > 0) {
                gsap.from(items, {
                  scrollTrigger: { trigger: grid, start: "top 80%" },
                  y: 50, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)"
                });
              }
            });
          });

          // 3. Split Layouts
          gsap.utils.toArray('.split-layout').forEach(split => {
            const textSide = split.querySelector('.split-text');
            const imgSide = split.querySelector('.split-image');
            if (textSide) {
              gsap.from(textSide, {
                scrollTrigger: { trigger: split, start: "top 75%" },
                x: -50, opacity: 0, duration: 1, ease: "power3.out"
              });
            }
            if (imgSide) {
              gsap.from(imgSide, {
                scrollTrigger: { trigger: split, start: "top 75%" },
                x: 50, opacity: 0, scale: 0.9, duration: 1, ease: "power3.out", delay: 0.2
              });
            }
          });

          // 4. Button Pop-in
          gsap.utils.toArray('.btn').forEach(btn => {
            if (!btn.closest('#scene-hero')) {
              gsap.from(btn, {
                scrollTrigger: { trigger: btn, start: "top 90%" },
                scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.5)", delay: 0.1
              });
            }
          });

        } catch (err) {
          console.error("Universal GSAP Error:", err);
        }
      }
"""

# Find the end of the .then block
pattern = r"(\s+})\n\s+\.catch\(error => console\.error\('Error fetching data:', error\)\);"

match = re.search(pattern, content)
if match:
    new_content = content[:match.start()] + animation_code + content[match.start():]
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Injected GSAP global animations.")
else:
    print("Could not find injection point.")
