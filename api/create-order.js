const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://shemnvgjpwetoljxrkjw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, numGuests } = req.body;

  try {
    // 1. Fetch room price
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('price_per_night')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      return res.status(400).json({ error: 'Room not found' });
    }

    // 2. Calculate nights and total amount
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return res.status(400).json({ error: 'Invalid dates' });
    }

    const totalAmount = room.price_per_night * diffDays;
    const amountInPaise = Math.round(totalAmount * 100);

    // 3. Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);

    // 4. Create pending booking in DB
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        room_id: roomId,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: numGuests,
        total_amount: totalAmount,
        payment_status: 'pending',
        razorpay_order_id: order.id
      }])
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
