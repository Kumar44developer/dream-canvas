-- Add OAuth columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN provider text NOT NULL DEFAULT 'email',
ADD COLUMN provider_id text;

-- Update the handle_new_user function to capture OAuth provider info
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_provider text;
  user_provider_id text;
BEGIN
  -- Determine provider from app_metadata
  user_provider := COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email');
  
  -- Get provider-specific ID if available
  IF NEW.raw_app_meta_data ? 'provider_id' THEN
    user_provider_id := NEW.raw_app_meta_data ->> 'provider_id';
  ELSIF NEW.raw_user_meta_data ? 'sub' THEN
    user_provider_id := NEW.raw_user_meta_data ->> 'sub';
  END IF;

  INSERT INTO public.profiles (id, full_name, email, credits, provider, provider_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email,
    10,
    user_provider,
    user_provider_id
  );
  RETURN NEW;
END;
$$;