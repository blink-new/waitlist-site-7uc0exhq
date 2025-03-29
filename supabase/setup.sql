
-- Create the waitlist table
create table public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  position integer not null,
  referral_code text not null unique,
  referred_by text references waitlist(referral_code),
  referral_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to increment referral count
create or replace function increment_referral_count(ref_code text)
returns void as $$
begin
  update waitlist
  set referral_count = referral_count + 1
  where referral_code = ref_code;
end;
$$ language plpgsql;

-- Create indexes for better performance
create index waitlist_email_idx on waitlist(email);
create index waitlist_referral_code_idx on waitlist(referral_code);
create index waitlist_referred_by_idx on waitlist(referred_by);

-- Set up row level security
alter table waitlist enable row level security;

-- Allow anonymous insert
create policy "Allow anonymous insert" on waitlist
  for insert with check (true);

-- Allow anonymous select
create policy "Allow anonymous select" on waitlist
  for select using (true);

-- Allow anonymous update of referral_count
create policy "Allow anonymous update referral_count" on waitlist
  for update using (true)
  with check (true);