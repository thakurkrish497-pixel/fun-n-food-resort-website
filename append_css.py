with open("style.css", "a", encoding="utf-8") as f:
    f.write("\n/* Performance Optimizations for GSAP Animations */\n")
    f.write(".section-title, .section-text, .facility-card, .room-card, .gallery-img, .brand-card, .footer-col, .split-text, .split-image, .btn {\n")
    f.write("  will-change: transform, opacity;\n")
    f.write("}\n")
