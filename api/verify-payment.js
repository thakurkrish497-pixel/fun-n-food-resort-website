const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://shemnvgjpwetoljxrkjw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          razorpay_payment_id: razorpay_payment_id
        })
        .eq('id', bookingId);

      if (error) throw error;
      
      res.status(200).json({ success: true, message: 'Payment verified and booking confirmed.' });
    } else {
      // Signature mismatch
      await supabase
        .from('bookings')
        .update({ payment_status: 'failed' })
        .eq('id', bookingId);
        
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Verify Payment Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
