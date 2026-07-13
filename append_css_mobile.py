css_rules = """
/* Desktop Menu Toggle Default (Hidden) */
.menu-toggle {
  display: none;
  font-size: 1.5rem;
  color: var(--bg-white);
  cursor: pointer;
  z-index: 1001;
}

/* Mobile Responsive Optimizations */
@media (max-width: 768px) {
  /* Header & Navigation */
  .menu-toggle {
    display: block;
  }
  .header-actions {
    display: none; /* Hide location and book now on mobile to save space */
  }
  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 250px;
    height: 100vh;
    background-color: var(--primary-color);
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    padding-top: 80px;
  }
  .nav.active {
    right: 0;
  }
  .nav-list {
    flex-direction: column !important;
    gap: 20px;
    align-items: center;
  }
  
  /* Layouts & Grids */
  .split-layout {
    flex-direction: column !important;
    text-align: center;
  }
  .split-text {
    padding: 0;
  }
  .split-text .section-title {
    text-align: center !important;
  }
  .split-image img {
    margin-top: 20px;
  }
  .grid, .footer-grid, .booking-grid, .facilities-grid {
    grid-template-columns: 1fr !important;
  }
  .statement-columns-anim {
    flex-direction: column;
    gap: 20px;
  }
  
  /* Typography & Spacing */
  .large-title {
    font-size: 3.5rem !important;
  }
  .section-title {
    font-size: 2rem !important;
  }
  .hero-subtext {
    font-size: 1rem !important;
  }
  .section {
    padding: 60px 20px;
  }
  .header {
    padding: 0 20px;
  }
  
  /* Carousel Adjustments */
  .carousel-item img {
    width: 250px;
    height: 350px;
  }
}
"""

with open("style.css", "a", encoding="utf-8") as f:
    f.write("\n" + css_rules)

print("Appended mobile CSS rules")
