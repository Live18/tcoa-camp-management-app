ALTER TABLE profiles
ADD COLUMN verification_token TEXT,
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN phone_verified BOOLEAN DEFAULT false,
ADD COLUMN verification_method TEXT DEFAULT 'email';

CREATE INDEX idx_profiles_verification_toke ON profiles(verification_token);

UPDATE profiles SET email_verified = true WHERE email_verified IS NULL;
