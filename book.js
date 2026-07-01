const SUPABASE_URL = 'https://shemnvgjpwetoljxrkjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dkdAC8Q-78JEZmWm2B3IEg_frXP3JdH';
let supabaseClient;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
  const roomSelect = document.getElementById('room-select');
  const checkIn = document.getElementById('check-in');
  const checkOut = document.getElementById('check-out');
  const previewImg = document.getElementById('preview-img');
  const previewTitle = document.getElementById('preview-title');
  const previewDesc = document.getElementById('preview-desc');
  const priceNight = document.getElementById('price-night');
  const numNights = document.getElementById('num-nights');
  const totalAmount = document.getElementById('total-amount');
  const payBtn = document.getElementById('pay-btn');
  const form = document.getElementById('booking-form');
  const availabilityMsg = document.getElementById('availability-msg');

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  checkIn.min = today;
  checkIn.addEventListener('change', () => {
    checkOut.min = checkIn.value;
    calculatePrice();
  });
  checkOut.addEventListener('change', calculatePrice);

  let roomsData = [];

  // Fetch Rooms from Supabase
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('rooms').select('*');
    if (!error && data) {
      roomsData = data;
      roomSelect.innerHTML = '<option value="">Select a room...</option>';
      data.forEach(room => {
        const opt = document.createElement('option');
        opt.value = room.id;
        opt.textContent = `${room.name} - ₹${room.price_per_night}/night`;
        roomSelect.appendChild(opt);
      });
    }
  }

  // Update Preview when room changes
  roomSelect.addEventListener('change', () => {
    const selected = roomsData.find(r => r.id === roomSelect.value);
    if (selected) {
      previewImg.src = selected.image_url;
      previewTitle.textContent = selected.name;
      previewDesc.textContent = selected.description;
      priceNight.textContent = `₹${selected.price_per_night}`;
      calculatePrice();
    } else {
      previewTitle.textContent = 'Select a room';
      previewDesc.textContent = 'Details will appear here.';
      priceNight.textContent = '₹0';
      payBtn.disabled = true;
    }
  });

  function calculatePrice() {
    const selected = roomsData.find(r => r.id === roomSelect.value);
    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);
    
    if (selected && start && end && end > start) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      numNights.textContent = diffDays;
      const total = diffDays * selected.price_per_night;
      totalAmount.textContent = `₹${total}`;
      payBtn.disabled = false;
      availabilityMsg.textContent = '';
    } else {
      numNights.textContent = '0';
      totalAmount.textContent = '₹0';
      payBtn.disabled = true;
      if (start && end && end <= start) {
        availabilityMsg.textContent = 'Check-out date must be after check-in date.';
      }
    }
  }

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    const payload = {
      roomId: roomSelect.value,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      numGuests: document.getElementById('num-guests').value,
      guestName: document.getElementById('guest-name').value,
      guestEmail: document.getElementById('guest-email').value,
      guestPhone: document.getElementById('guest-phone').value
    };

    try {
      // 1. Create order on backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Fun N Food Resort",
        description: "Room Booking Advance",
        image: "assets/images/new_photos/IMG_3211.JPG.jpeg",
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment on backend
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: data.bookingId
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('Payment successful! Your booking is confirmed.');
            window.location.href = 'index.html';
          } else {
            alert('Payment verification failed.');
            payBtn.disabled = false;
            payBtn.textContent = 'Proceed to Payment';
          }
        },
        prefill: {
          name: payload.guestName,
          email: payload.guestEmail,
          contact: payload.guestPhone
        },
        theme: {
          color: "#2C3E50"
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
        payBtn.disabled = false;
        payBtn.textContent = 'Proceed to Payment';
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('An error occurred. ' + err.message);
      payBtn.disabled = false;
      payBtn.textContent = 'Proceed to Payment';
    }
  });
});
