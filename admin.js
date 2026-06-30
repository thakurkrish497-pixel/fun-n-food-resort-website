document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');
  const saveAllBtn = document.getElementById('save-all-btn');
  const saveMsg = document.getElementById('save-msg');

  // Check auth state
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    showDashboard();
  }

  // Strict security: Clear token when the page unloads
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('adminToken');
  });

  // Handle Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        showDashboard();
      } else {
        loginError.textContent = data.error || 'Login failed';
      }
    } catch (err) {
      loginError.textContent = 'Server error. Is the Node.js server running?';
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminToken');
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
  });

  // Sidebar navigation
  document.querySelectorAll('.admin-nav li').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
      document.querySelectorAll('.cms-section').forEach(sec => sec.classList.remove('active'));
      
      e.target.classList.add('active');
      const targetId = e.target.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
      
      if (targetId === 'section-enquiries') {
        loadEnquiries();
      }
    });
  });

  let siteData = {};

  async function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'flex';
    
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        siteData = await res.json();
        populateForm(siteData);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    }
  }

  function populateForm(data) {
    // Hero
    document.getElementById('hero-title').value = data.hero.title;
    document.getElementById('hero-text').value = data.hero.text;
    document.getElementById('hero-bg').value = data.hero.bgImage;
    document.getElementById('hero-bg-preview').innerHTML = `<img src="${data.hero.bgImage}" width="200">`;

    // Brands
    document.getElementById('brands-title').value = data.brands.title;
    document.getElementById('brands-text').value = data.brands.text;
    const brandsList = document.getElementById('brands-list');
    brandsList.innerHTML = '';
    data.brands.items.forEach((brand, index) => {
      const div = document.createElement('div');
      div.style.border = '1px solid #ddd';
      div.style.padding = '15px';
      div.style.marginBottom = '15px';
      div.innerHTML = `
        <div class="form-group"><label>Brand Name</label><input type="text" id="brand-name-${index}" class="cms-input" value="${brand.name}"></div>
        <div class="form-group"><label>Location</label><input type="text" id="brand-location-${index}" class="cms-input" value="${brand.location}"></div>
        <div class="form-group"><label>Logo / Image</label>
          <div class="image-preview" id="brand-img-preview-${index}"><img src="${brand.image}" width="100"></div>
          <input type="hidden" id="brand-img-${index}" value="${brand.image}">
          <input type="file" id="brand-upload-${index}" accept="image/*" onchange="uploadImage(event, 'brand-img-${index}', 'brand-img-preview-${index}')">
        </div>
      `;
      brandsList.appendChild(div);
    });

    // Facilities
    document.getElementById('fac-title').value = data.facilities.title;
    const facList = document.getElementById('facilities-list');
    facList.innerHTML = '';
    data.facilities.items.forEach((fac, index) => {
      const div = document.createElement('div');
      div.style.border = '1px solid #ddd';
      div.style.padding = '15px';
      div.style.marginBottom = '15px';
      div.innerHTML = `
        <div class="form-group"><label>Title</label><input type="text" id="fac-title-${index}" class="cms-input" value="${fac.title}"></div>
        <div class="form-group"><label>Text</label><textarea id="fac-text-${index}" class="cms-input" rows="2">${fac.text}</textarea></div>
        <div class="form-group"><label>Image</label>
          <div class="image-preview" id="fac-img-preview-${index}"><img src="${fac.image}" width="100"></div>
          <input type="hidden" id="fac-img-${index}" value="${fac.image}">
          <input type="file" id="fac-upload-${index}" accept="image/*" onchange="uploadImage(event, 'fac-img-${index}', 'fac-img-preview-${index}')">
        </div>
      `;
      facList.appendChild(div);
    });

    // Dining
    document.getElementById('dining-title').value = data.dining.title;
    document.getElementById('dining-text').value = data.dining.text;
    document.getElementById('dining-img').value = data.dining.image;
    document.getElementById('dining-img-preview').innerHTML = `<img src="${data.dining.image}" width="200">`;

    // Events
    document.getElementById('events-title').value = data.events.title;
    document.getElementById('events-text').value = data.events.text;
    document.getElementById('events-img').value = data.events.image;
    document.getElementById('events-img-preview').innerHTML = `<img src="${data.events.image}" width="200">`;
    
    // Contact
    document.getElementById('contact-address').value = data.contact.address;
    document.getElementById('contact-phone').value = data.contact.phone;
    document.getElementById('contact-email').value = data.contact.email;
    document.getElementById('contact-map').value = data.contact.mapUrl;
    
    // Gallery
    renderGallery();
  }
  
  function renderGallery() {
    const galleryList = document.getElementById('gallery-list');
    galleryList.innerHTML = '';
    siteData.gallery.forEach((url, index) => {
      const div = document.createElement('div');
      div.style.position = 'relative';
      div.innerHTML = `
        <img src="${url}" width="150" height="100" style="object-fit: cover; border-radius: 4px;">
        <button type="button" class="btn" style="position: absolute; top: 5px; right: 5px; padding: 2px 6px; background: red; color: white; border: none; font-size: 12px; cursor:pointer;" onclick="deleteGalleryImage(${index})">X</button>
      `;
      galleryList.appendChild(div);
    });
  }
  
  window.deleteGalleryImage = function(index) {
    siteData.gallery.splice(index, 1);
    renderGallery();
  };
  
  document.getElementById('gallery-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        siteData.gallery.push(data.url);
        renderGallery();
        document.getElementById('gallery-upload').value = '';
      }
    } catch (err) {}
  });

  // Handle Save All
  saveAllBtn.addEventListener('click', async () => {
    saveMsg.textContent = 'Saving...';
    
    siteData.hero.title = document.getElementById('hero-title').value;
    siteData.hero.text = document.getElementById('hero-text').value;
    siteData.hero.bgImage = document.getElementById('hero-bg').value;

    siteData.brands.title = document.getElementById('brands-title').value;
    siteData.brands.text = document.getElementById('brands-text').value;
    siteData.brands.items.forEach((brand, index) => {
      brand.name = document.getElementById(`brand-name-${index}`).value;
      brand.location = document.getElementById(`brand-location-${index}`).value;
      brand.image = document.getElementById(`brand-img-${index}`).value;
    });

    siteData.facilities.title = document.getElementById('fac-title').value;
    siteData.facilities.items.forEach((fac, index) => {
      fac.title = document.getElementById(`fac-title-${index}`).value;
      fac.text = document.getElementById(`fac-text-${index}`).value;
      fac.image = document.getElementById(`fac-img-${index}`).value;
    });

    siteData.dining.title = document.getElementById('dining-title').value;
    siteData.dining.text = document.getElementById('dining-text').value;
    siteData.dining.image = document.getElementById('dining-img').value;

    siteData.events.title = document.getElementById('events-title').value;
    siteData.events.text = document.getElementById('events-text').value;
    siteData.events.image = document.getElementById('events-img').value;

    siteData.contact.address = document.getElementById('contact-address').value;
    siteData.contact.phone = document.getElementById('contact-phone').value;
    siteData.contact.email = document.getElementById('contact-email').value;
    siteData.contact.mapUrl = document.getElementById('contact-map').value;

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(siteData)
      });
      if (res.ok) {
        saveMsg.textContent = 'Changes saved successfully!';
        setTimeout(() => saveMsg.textContent = '', 3000);
      } else {
        saveMsg.textContent = 'Error saving changes.';
        saveMsg.style.color = 'red';
      }
    } catch (err) {
      saveMsg.textContent = 'Server error.';
      saveMsg.style.color = 'red';
    }
  });

  document.getElementById('hero-bg-upload').addEventListener('change', (e) => uploadImage(e, 'hero-bg', 'hero-bg-preview'));
  document.getElementById('dining-upload').addEventListener('change', (e) => uploadImage(e, 'dining-img', 'dining-img-preview'));
  document.getElementById('events-upload').addEventListener('change', (e) => uploadImage(e, 'events-img', 'events-img-preview'));

  window.uploadImage = async function(e, inputId, previewId) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    const prev = document.getElementById(previewId);
    prev.innerHTML = 'Uploading...';

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        document.getElementById(inputId).value = data.url;
        prev.innerHTML = `<img src="${data.url}" width="200">`;
      } else {
        prev.innerHTML = `<span style="color:red">Upload failed</span>`;
      }
    } catch (err) {
      prev.innerHTML = `<span style="color:red">Error</span>`;
    }
  };
  
  // Load Enquiries
  document.getElementById('refresh-enquiries-btn').addEventListener('click', loadEnquiries);
  
  async function loadEnquiries() {
    const list = document.getElementById('enquiries-list');
    list.innerHTML = 'Loading...';
    try {
      const res = await fetch('/api/enquiries', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        list.innerHTML = '';
        if(data.length === 0) {
          list.innerHTML = '<p>No enquiries yet.</p>';
          return;
        }
        data.reverse().forEach(enq => {
          const div = document.createElement('div');
          div.style.border = '1px solid #ddd';
          div.style.padding = '15px';
          div.style.marginBottom = '15px';
          div.style.borderRadius = '4px';
          div.innerHTML = `
            <strong>${enq.firstName} ${enq.lastName}</strong> (<a href="mailto:${enq.email}">${enq.email}</a>)<br>
            <small>${new Date(enq.date).toLocaleString()}</small>
            <p><strong>Phone:</strong> ${enq.phone}</p>
            <p style="background: #f9f9f9; padding: 10px; margin-top: 10px;">${enq.message}</p>
          `;
          list.appendChild(div);
        });
      }
    } catch(e) {
      list.innerHTML = 'Failed to load enquiries.';
    }
  }
});
