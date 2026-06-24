-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Users Table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Users
alter table public.users enable row level security;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- Trigger to automatically create a profile in public.users when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Consultations Table
create table public.consultations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  chronology text not null,
  ai_analysis text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Consultations
alter table public.consultations enable row level security;
create policy "Users can view their own consultations" on public.consultations for select using (auth.uid() = user_id);
create policy "Users can insert their own consultations" on public.consultations for insert with check (auth.uid() = user_id);
create policy "Users can delete their own consultations" on public.consultations for delete using (auth.uid() = user_id);

-- 3. Create Subscriptions Table (MVP Dummy Flow)
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  plan_type text not null, -- 'Basic' or 'Professional'
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null, -- 'Active' or 'Expired'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;
create policy "Users can view their own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

