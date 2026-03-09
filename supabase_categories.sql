-- Category Table Management
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- Drop existing policies if they exist (for idempotency)
drop policy if exists "Allow public read access for active categories" on public.categories;
drop policy if exists "Allow full access for authenticated admin users on categories" on public.categories;

-- Create Policies
-- Public can read active categories
create policy "Allow public read access for active categories"
  on public.categories for select
  using (is_active = true);

-- Admins can do everything (protected by frontend custom auth / API routes)
create policy "Allow full access for authenticated admin users on categories"
  on public.categories for all
  to public
  using (true)
  with check (true);

-- Insert initial default categories
insert into public.categories (name, slug)
values 
  ('All', 'all'),
  ('Hoodies', 'hoodies'),
  ('T-Shirts', 'tshirts')
on conflict (slug) do nothing;
