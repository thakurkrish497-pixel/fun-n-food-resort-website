document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('header');

  // Mobile Menu Toggle
  if(menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Header Scroll Effect (only for index)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'var(--primary-color)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        header.style.backgroundColor = 'transparent';
        header.style.boxShadow = 'none';
      }
    });
  }

  // Fetch Data and Render Content
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      const path = window.location.pathname;

      // --- Common Elements (Footer) ---
      const footerAddress = document.getElementById('footer-address');
      if (footerAddress && data.contact) footerAddress.textContent = data.contact.address;

      // Helper to preserve line breaks
      const formatText = (text) => text ? text.replace(/\n\n/g, '<br><br>') : '';

      // --- Index Page ---
      if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        document.getElementById('hero-title').textContent = data.hero.title;
        document.getElementById('hero-text').innerHTML = formatText(data.hero.text);
        document.getElementById('hero-bg').src = data.hero.bgImage;

        // Render Brands
        document.getElementById('brands-title').textContent = data.brands.title;
        document.getElementById('brands-text').innerHTML = formatText(data.brands.text);
        const brandsContainer = document.getElementById('brands-container');
        if (brandsContainer) {
          data.brands.items.forEach(brand => {
            const el = document.createElement('div');
            el.className = 'brand-card';
            el.innerHTML = `
              <img src="${brand.image}" alt="${brand.name}">
              <div class="brand-info">
                <h3>${brand.name}</h3>
                <p>${brand.location}</p>
              </div>
            `;
            brandsContainer.appendChild(el);
          });
        }

        // Render Facilities Preview
        document.getElementById('fac-title').textContent = data.facilities.title;
        const facContainer = document.getElementById('facilities-container');
        if(facContainer) {
          data.facilities.items.slice(0, 3).forEach(fac => {
            const el = document.createElement('div');
            el.className = 'facility-card';
            el.innerHTML = `
              <div class="facility-img-container"><img src="${fac.image}" alt="${fac.title}" class="facility-img"></div>
              <div class="facility-content">
                <h3 class="facility-title">${fac.title}</h3>
                <p>${formatText(fac.text)}</p>
              </div>
            `;
            facContainer.appendChild(el);
          });
        }

        // Render Dining Preview
        document.getElementById('dining-title').textContent = data.dining.title;
        document.getElementById('dining-text').innerHTML = formatText(data.dining.text).substring(0, 200) + '...';
        document.getElementById('dining-img').src = data.dining.image;

        // Render Events Preview
        document.getElementById('events-title').textContent = data.events.title;
        document.getElementById('events-text').innerHTML = formatText(data.events.text).substring(0, 200) + '...';
        document.getElementById('events-img').src = data.events.image;
      }

      // --- Facilities Page ---
      if (path.endsWith('facilities.html')) {
        document.getElementById('fac-title').textContent = data.facilities.title;
        const facContainer = document.getElementById('facilities-container');
        if(facContainer) {
          data.facilities.items.forEach(fac => {
            const el = document.createElement('div');
            el.className = 'facility-card';
            el.innerHTML = `
              <div class="facility-img-container"><img src="${fac.image}" alt="${fac.title}" class="facility-img"></div>
              <div class="facility-content">
                <h3 class="facility-title">${fac.title}</h3>
                <p>${formatText(fac.text)}</p>
              </div>
            `;
            facContainer.appendChild(el);
          });
        }
      }

      // --- Dining Page ---
      if (path.endsWith('dining.html')) {
        document.getElementById('dining-title').textContent = data.dining.title;
        document.getElementById('dining-text').innerHTML = formatText(data.dining.text);
        document.getElementById('dining-img').src = data.dining.image;
      }

      // --- Events Page ---
      if (path.endsWith('events.html')) {
        document.getElementById('events-title').textContent = data.events.title;
        document.getElementById('events-text').innerHTML = formatText(data.events.text);
        document.getElementById('events-img').src = data.events.image;
      }

      // --- Gallery Page ---
      if (path.endsWith('gallery.html')) {
        const galContainer = document.getElementById('gallery-container');
        if(galContainer) {
          data.gallery.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'gallery-img';
            galContainer.appendChild(img);
          });
        }
      }

      // --- Contact Page ---
      if (path.endsWith('contact.html')) {
        document.getElementById('c-address').textContent = data.contact.address;
        document.getElementById('c-phone').textContent = data.contact.phone;
        document.getElementById('c-email').textContent = data.contact.email;
        document.getElementById('c-map').src = data.contact.mapUrl;
        
        // Handle Form Submission
        const form = document.getElementById('enquiry-form');
        const msgBox = document.getElementById('enquiry-msg');
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            msgBox.textContent = 'Sending...';
            msgBox.style.color = '#333';
            
            const payload = {
              firstName: document.getElementById('eq-first-name').value,
              lastName: document.getElementById('eq-last-name').value,
              email: document.getElementById('eq-email').value,
              phone: document.getElementById('eq-phone').value,
              message: document.getElementById('eq-message').value,
            };
            
            try {
              const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) {
                msgBox.textContent = 'Thank you! Your enquiry has been submitted.';
                msgBox.style.color = 'green';
                form.reset();
              } else {
                msgBox.textContent = 'Error submitting enquiry. Please try again.';
                msgBox.style.color = 'red';
              }
            } catch(e) {
              msgBox.textContent = 'Network error. Please try again.';
              msgBox.style.color = 'red';
            }
          });
        }
      }

    })
    .catch(error => console.error('Error fetching data:', error));
});
