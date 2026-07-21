import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

old_block = """            // Make the entire ring rotate continuously around the text
            gsap.to('.carousel', {
              rotation: 360,
              duration: 7,
              repeat: -1,
              ease: "none",
              transformOrigin: "center 80px" // Match the y+80 shift of the items
            });"""

new_block = """            // Make the entire ring rotate continuously around the text
            gsap.to('.carousel', {
              rotation: 360,
              duration: 7,
              repeat: -1,
              ease: "none",
              transformOrigin: "center 80px", // Match the y+80 shift of the items
              onUpdate: function() {
                // Dynamically adjust opacity based on position to simulate 3D passing behind text
                const currentRot = this.targets()[0]._gsap.rotation;
                items.forEach((item, i) => {
                  const initialAngle = (i / items.length) * 360;
                  const absAngle = (initialAngle + currentRot) % 360;
                  // Math.cos is 1 at Top (0 deg) and -1 at Bottom (180 deg)
                  // Fades to 0.2 at the top (behind text) and 1.0 at the bottom (front)
                  const op = 0.6 - 0.4 * Math.cos(absAngle * Math.PI / 180);
                  item.style.opacity = op;
                });
              }
            });"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully added sequential fading physics.")
else:
    print("Error: Could not find the target block in script.js to replace.")
