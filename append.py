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

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(new_css)
