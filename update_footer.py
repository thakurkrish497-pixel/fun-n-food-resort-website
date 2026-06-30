import glob
import re

footer_html = """  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>About Fun N Food</h3>
          <p>A prestigious property of the SKCPL Group — your complete leisure destination in Indore, featuring a thrilling water park, luxurious rooms, multi-cuisine dining, and sprawling marriage gardens.</p>
        </div>
        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="facilities.html">Facilities</a></li>
            <li><a href="dining.html">Dining</a></li>
            <li><a href="gallery.html">Gallery</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Legal</h3>
          <ul class="footer-links">
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="privacy.html">Terms & Conditions</a></li>
            <li><a href="privacy.html">Cancellation Policy</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact Us</h3>
          <p id="footer-address">Khandwa Road, near BSNL Exchange, Tejaji Nagar, Indore, Madhya Pradesh</p>
          <p><strong>Phone:</strong> +91 94798 00333</p>
          <p><strong>Email:</strong> funandfoodresort@gmail.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Fun N Food Resort (SKCPL Group). All rights reserved.</p>
        <a href="admin.html" class="admin-link"><i class="fa-solid fa-lock"></i> Admin Login</a>
      </div>
    </div>
  </footer>"""

for file in glob.glob('*.html'):
    if file == 'admin.html' or file == 'privacy.html': continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'<footer class="footer">.*?</footer>', footer_html, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
print('Updated footers!')
