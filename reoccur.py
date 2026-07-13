import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# I will replace all `start: "top 85%"` or `start: "top 80%"` or `start: "top 75%"` or `start: "top 90%"` 
# with the same string + `, toggleActions: "play none none reverse"`

content = re.sub(r'(start: "top \d+%")', r'\1, toggleActions: "play none none reverse"', content)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Added toggleActions to script.js")
