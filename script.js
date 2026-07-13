const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
let supabaseClient;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

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
  if (window.location.pathname.includes('index') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
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
  if (!supabaseClient) {
    console.error("Supabase client not initialized.");
    return;
  }
  
  supabaseClient.from('website_data').select('content').eq('id', 1).single()
    .then(({ data: dbData, error }) => {
      if (error) throw error;
      const data = dbData.content;
      
      const path = window.location.pathname;

      // --- Common Elements (Footer) ---
      const footerAddress = document.getElementById('footer-address');
      if (footerAddress && data.contact) footerAddress.textContent = data.contact.address;

      // Helper to safely set elements
      const setEl = (id, val, type='text') => {
        const el = document.getElementById(id);
        if (el) {
          if (type === 'html') el.innerHTML = val;
          else if (type === 'src') el.src = val;
          else el.textContent = val;
        }
      };
      
      const formatText = (text) => text ? text.replace(/\n\n/g, '<br><br>') : '';

      // --- Index Page ---
      if (path.includes('index') || path === '/' || path.endsWith('/')) {
        const hTitle = document.getElementById('hero-title');
        const hText = document.getElementById('hero-text');
        const hBg = document.getElementById('hero-bg');
        
        if (hTitle && hTitle.classList.contains('large-title') === false) hTitle.textContent = data.hero.title;
        if (hText) hText.innerHTML = formatText(data.hero.text);
        if (hBg) hBg.src = data.hero.bgImage;

        // GSAP Scroll Animation
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          try {
            gsap.registerPlugin(ScrollTrigger);

            const carousel = document.querySelector('.carousel');
            const items = document.querySelectorAll('.carousel-item');
            const radius = 450; // Perfect circle radius
            
            items.forEach((item, i) => {
              // Distribute evenly in a full 360 circle
              const angle = (i / items.length) * Math.PI * 2;
              
              // Standard 2D circle math
              const x = Math.sin(angle) * radius;
              const y = -Math.cos(angle) * radius; 
              
              // Rotated 90 degrees relative to the center
              const rotationZ = (angle * 180 / Math.PI) + 90;

              gsap.set(item, { 
                xPercent: -50, 
                yPercent: -50, 
                x: x, 
                y: y + 80, // Center around the text
                rotation: rotationZ, // 2D flat rotation
                willChange: "transform" 
              });
            });

            // Make the entire ring rotate continuously around the text
            gsap.to('.carousel', {
              rotation: 360,
              duration: 10,
              repeat: -1,
              ease: "linear",
              transformOrigin: "center 80px" // Match the y+80 shift of the items
            });

            // Master Timeline pinned to #pin-master
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: "#pin-master",
                start: "top top",
                end: "+=4000", 
                scrub: 1,
                pin: true,
                anticipatePin: 1
              }
            });

            // 1. Disperse Ring & Fade Out (Explode on scroll)
            items.forEach((item, i) => {
              const angle = (i / items.length) * Math.PI * 2;
              tl.to(item, {
                x: Math.sin(angle) * 2000,
                y: -Math.cos(angle) * 2000 + 80,
                scale: 2,
                opacity: 0,
                duration: 1
              }, 0);
            });

            tl.to('.carousel-center-info', { opacity: 0, scale: 0.8, duration: 0.5 }, 0)
              .to('#scene-hero', { opacity: 0, duration: 0.5 }, 0.5);
              
          // 2. Change background color and show Statement Scene
          tl.to('#pin-master', { background: 'var(--cream-block)', duration: 0.5 }, 0.5)
            .to('#scene-statement', { opacity: 1, duration: 0.1 }, 0.5);

          // 3. Statement columns slide up
          tl.to('.statement-columns-anim', { opacity: 1, y: 0, duration: 0.8 }, 0.8);

          // 4. Inline images expand
          tl.to('.inline-img-box', { width: '120px', margin: '0 15px', duration: 1 }, 1.2);

          // 5. Hide Statement, Show Giant Text
          tl.to('#scene-statement', { opacity: 0, duration: 0.5 }, 2.5)
            .to('#scene-giant', { opacity: 1, duration: 0.1 }, 2.5);

          // 6. Slide in Giant Text & Center Image appears
          tl.to('.loc-left', { left: '5%', duration: 1 }, 2.6)
            .to('.loc-right', { right: '5%', duration: 1 }, 2.6)
            .to('.loc-center-img-anim', { width: 320, height: 180, opacity: 1, duration: 1, ease: "back.out(1.7)" }, 2.6);

          // 7. Expand Center Image to cover screen (using width/height instead of scale)
          tl.to('.loc-left', { x: -500, opacity: 0, duration: 1 }, 4)
            .to('.loc-right', { x: 500, opacity: 0, duration: 1 }, 4)
            .to('.loc-center-img-anim', { 
              width: "100vw", 
              height: "100vh", 
              borderRadius: "0px",
              duration: 2, 
              ease: "power2.inOut" 
            }, 4);

          // 8. Show Marquee over the image
          tl.to('#scene-gallery', { opacity: 1, duration: 0.1 }, 5.5)
            .to('.marquee-bar-anim', { opacity: 1, y: 0, duration: 0.5 }, 5.5);
            
          // Marquee continuous animation (independent of scroll)
          gsap.to('.marquee-content-anim', {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "linear"
          });
          
        } catch (e) {
          console.error("GSAP Animation Error:", e);
        }
        }

        // Render Brands
        setEl('brands-title', data.brands.title, 'text');
        setEl('brands-text', formatText(data.brands.text), 'html');
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
        setEl('fac-title', data.facilities.title, 'text');
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
        setEl('dining-title', data.dining.title, 'text');
        setEl('dining-text', formatText(data.dining.text).substring(0, 200) + '...', 'html');
        setEl('dining-img', data.dining.image, 'src');

        // Render Events Preview
        setEl('events-title', data.events.title, 'text');
        setEl('events-text', formatText(data.events.text).substring(0, 200) + '...', 'html');
        setEl('events-img', data.events.image, 'src');
      }

      // --- Facilities Page ---
      if (path.includes('facilities')) {
        setEl('fac-title', data.facilities.title, 'text');
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
      if (path.includes('dining')) {
        setEl('dining-title', data.dining.title, 'text');
        setEl('dining-text', formatText(data.dining.text), 'html');
        setEl('dining-img', data.dining.image, 'src');
      }

      // --- Events Page ---
      if (path.includes('events')) {
        setEl('events-title', data.events.title, 'text');
        setEl('events-text', formatText(data.events.text), 'html');
        setEl('events-img', data.events.image, 'src');
      }

      // --- Gallery Page ---
      if (path.includes('gallery')) {
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
      if (path.includes('contact')) {
        setEl('c-address', data.contact.address, 'text');
        setEl('c-phone', data.contact.phone, 'text');
        setEl('c-email', data.contact.email, 'text');
        setEl('c-map', data.contact.mapUrl, 'src');
        
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
              const { error } = await supabaseClient.from('enquiries').insert([{
                first_name: payload.firstName,
                last_name: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                message: payload.message
              }]);
              
              if(!error) {
                msgBox.textContent = 'Thank you! Your enquiry has been submitted.';
                msgBox.style.color = 'green';
                form.reset();
              } else {
                msgBox.textContent = 'Error submitting enquiry. Please try again.';
                msgBox.style.color = 'red';
                console.error(error);
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
