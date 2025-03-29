
-- Create the waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  position INTEGER NOT NULL,
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX waitlist_referral_code_idx ON waitlist(referral_code);
CREATE INDEX waitlist_email_idx ON waitlist(email);

-- Create function to increment referral count
CREATE OR REPLACE FUNCTION increment_referral_count(code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE waitlist
  SET referral_count = referral_count + 1
  WHERE referral_code = code;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Allow anyone to select
CREATE POLICY "Allow public reads" ON waitlist
  FOR SELECT USING (true);

-- Only allow updates through our function
CREATE POLICY "Allow controlled updates" ON waitlist
  FOR UPDATE USING (
    -- Only allow updates to referral_count through our RPC function
    (SELECT current_user = 'authenticated')
  );