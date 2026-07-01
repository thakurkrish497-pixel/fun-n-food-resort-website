-- 1. Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price_per_night numeric not null,
  total_inventory integer not null default 1,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Insert initial room data
INSERT INTO public.rooms (name, description, price_per_night, total_inventory, image_url) 
VALUES (
  'Deluxe Resort Room', 
  'Luxurious air-conditioned room with modern amenities, premium bedding, and a peaceful ambiance.', 
  3500.00, 
  10, 
  'https://shemnvgjpwetoljxrkjw.supabase.co/storage/v1/object/public/website-images/gallery_1700000000000.jpeg'
);

-- 3. Room Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON public.rooms FOR SELECT USING ( true );
CREATE POLICY "Admin Write Access" ON public.rooms FOR ALL USING ( auth.role() = 'authenticated' );

-- 4. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.rooms(id) not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in date not null,
  check_out date not null,
  num_guests integer not null,
  total_amount numeric not null,
  payment_status text not null default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Bookings Security
-- Note: Public does not get read/write access. All inserts are securely done via the Backend Serverless API to protect guest privacy.
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin All Access" ON public.bookings FOR ALL USING ( auth.role() = 'authenticated' );
