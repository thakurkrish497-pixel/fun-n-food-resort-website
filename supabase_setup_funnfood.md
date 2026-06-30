# Supabase Setup Instructions (Fun N Food Website)

Since we are moving to Vercel, we need a database to store your website content, images, and enquiries. Please follow these steps in your Supabase dashboard (`https://sakchnfmmddkaspwglow.supabase.co`).

### Step 1: Create the Database Tables
1. Go to your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. In the left sidebar, click on **SQL Editor** (the icon looks like a `>_` terminal).
3. Click **New Query** to open a blank editor.
4. Copy and paste the following SQL code exactly as it is:

```sql
-- Create the website_data table
create table public.website_data (
  id integer primary key default 1,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert the initial data structure (so the website isn't empty)
insert into public.website_data (id, content) values (1, '{}');

-- Create the enquiries table
create table public.enquiries (
  id uuid default gen_random_uuid() primary key,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  message text
);

-- Turn on Security (Row Level Security)
alter table public.website_data enable row level security;
alter table public.enquiries enable row level security;

-- Policies for website_data
create policy "Public Read Access" on public.website_data for select using ( true );
create policy "Admin Write Access" on public.website_data for all using ( auth.role() = 'authenticated' );

-- Policies for enquiries
create policy "Public Insert Access" on public.enquiries for insert using ( true );
create policy "Admin Read Access" on public.enquiries for select using ( auth.role() = 'authenticated' );
```
5. Click the **RUN** button (or press `Cmd/Ctrl + Enter`). You should see a success message!

### Step 2: Create the Storage Bucket
1. In the left sidebar of Supabase, click on **Storage** (the folder icon).
2. Click **New Bucket**.
3. Name the bucket exactly: `website-images` (all lowercase, with a dash).
4. **CRITICAL**: Make sure the **"Public bucket"** toggle is turned **ON**.
5. Click **Save**.
6. Once the bucket is created, click on it, go to the **Policies** tab at the top.
7. Under "Policies under website-images", click **New Policy** -> **For Full Customization**.
8. Name it `Allow All`
9. For ALLOWED OPERATIONS, check **SELECT**, **INSERT**, **UPDATE**, and **DELETE**.
10. Click **Review** and then **Save policy**.

### Step 3: Get your Anon Key
I need your `anon` public key to link your frontend website to this database!
1. Go to your Supabase project **Project Settings** (the gear icon at the bottom of the left sidebar).
2. Click on **API** in the settings menu.
3. Under "Project API keys", copy the string next to `anon` `public`.
4. **Please paste that key to me in our chat!**
