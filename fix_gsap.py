import re

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

# Fix the rotation tween
old_rot = """            gsap.to('.carousel', {
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

new_rot = """            gsap.to('.carousel', {
              rotation: "+=360",
              duration: 7,
              repeat: -1,
              ease: "none",
              transformOrigin: "center 80px", // Match the y+80 shift of the items
              onUpdate: function() {
                // Safe property read
                const currentRot = gsap.getProperty(this.targets()[0], "rotation");
                items.forEach((item, i) => {
                  const initialAngle = (i / items.length) * 360;
                  const absAngle = (initialAngle + currentRot) % 360;
                  const op = 0.65 - 0.35 * Math.cos(absAngle * Math.PI / 180);
                  
                  // Apply to the IMG inside, so it doesn't fight the ScrollTrigger opacity on the wrapper!
                  const img = item.querySelector('img');
                  if(img) {
                    gsap.set(img, { opacity: op });
                  }
                });
              }
            });"""

if old_rot in js:
    js = js.replace(old_rot, new_rot)
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Successfully patched rotation and fading physics.")
else:
    print("Could not find old rotation block. Attempting regex patch.")
    # Fallback regex if spacing is weird
    pattern = r"gsap\.to\('\.carousel', \{[\s\S]*?onUpdate: function\(\) \{[\s\S]*?\}\n            \}\);"
    if re.search(pattern, js):
        js = re.sub(pattern, new_rot, js)
        with open("script.js", "w", encoding="utf-8") as f:
            f.write(js)
        print("Patched via regex.")
    else:
        print("Failed to patch completely.")
