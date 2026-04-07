CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
	INSERT INTO public.profiles(
		id,
		email,
		role,
		email_verified,
		verification_token,
		verification_method
	)
	VALUES (
		NEW.id,
		NEW.email,
		COALESCE(New.raw_user_meta_data->>'name', 'Unknown'),
		COALESCE(NEW.raw_user_meta_data->>'role', 'camper'),
		false, --email set to unverified
		encode(gen_random_bytes(32), 'hex'), --set random token
		'email'  --Default verification method
	);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
