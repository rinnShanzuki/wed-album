# Supabase Setup Guide

To run this application, you need to set up a few things in your Supabase project.

## 1. Authentication
- Make sure Email/Password authentication is enabled.
- Create an Admin user via the Supabase Dashboard (Authentication -> Users -> Add user).

## 2. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create weddings table
CREATE TABLE public.weddings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    groom_name text NOT NULL,
    bride_name text NOT NULL,
    slug text NOT NULL,
    wedding_date date NOT NULL,
    ceremony_venue text NOT NULL,
    location text NOT NULL,
    reception_venue text NOT NULL,
    welcome_message text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT weddings_pkey PRIMARY KEY (id),
    CONSTRAINT weddings_slug_key UNIQUE (slug)
);

-- Create photos table
CREATE TABLE public.photos (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL,
    guest_name text NOT NULL,
    storage_path text NOT NULL,
    thumbnail_path text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT photos_pkey PRIMARY KEY (id),
    CONSTRAINT photos_wedding_id_fkey FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- Insert a sample wedding for James & Theade
INSERT INTO public.weddings (groom_name, bride_name, slug, wedding_date, ceremony_venue, location, reception_venue, welcome_message)
VALUES (
    'James', 
    'Theade', 
    'james-theade', 
    '2026-10-17', 
    'San Antonio Abad Parish', 
    'Bacolod City', 
    'Roy''s Hotel & Convention Centre',
    'Two lives, two hearts, joined together in friendship, united forever in love.'
);
```

## 3. Storage Bucket

1. Go to Storage in your Supabase dashboard.
2. Create a new bucket named **`wedding-photos`**.
3. **Important**: Set the bucket to **Public** so the images can be viewed.
4. To allow the backend to bypass any complex RLS, we use the `service_role` key in our `.env` file, but make sure the public policy allows `SELECT` (reading) images so guests can see the album.

```sql
-- Enable public access to the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'wedding-photos' );
```

## 4. Environment Variables

Update your `.env` file with your Supabase credentials:

```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SESSION_SECRET=a_very_long_and_random_string_here
```
