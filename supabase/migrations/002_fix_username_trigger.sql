-- Fix: handle_new_user() now generates a privacy-safe username
-- using the local part of the email + a random 4-digit suffix
-- instead of exposing the full email address.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  new_username TEXT;
BEGIN
  base_username := split_part(new.email, '@', 1);
  new_username := base_username || '_' || lpad(floor(random() * 10000)::text, 4, '0');

  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new_username)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add display_name column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
END
$$;
