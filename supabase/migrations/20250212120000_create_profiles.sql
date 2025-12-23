/*
  # Create Profiles Table

  ## Query Description: 
  This migration creates a 'profiles' table linked to 'auth.users'. It stores user profile information including their full name and selected exam type. It also sets up a trigger to automatically create a profile entry when a new user signs up.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: public.profiles
  - Columns: id (UUID, PK), full_name (TEXT), exam_type (TEXT), updated_at (TIMESTAMPTZ)
  - RLS: Enabled with policies for SELECT, INSERT, UPDATE.
  - Trigger: on_auth_user_created (calls handle_new_user)

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (Policies added for user access)
*/

-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  exam_type text,
  updated_at timestamp with time zone
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using ( true );

create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on public.profiles for update 
  using ( auth.uid() = id );

-- Create a function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
