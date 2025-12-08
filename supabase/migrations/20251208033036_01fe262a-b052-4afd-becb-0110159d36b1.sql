-- Drop the old restrictive check constraint
ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_package_type_check;

-- Add a more permissive constraint that allows any non-empty package type
-- (the actual validation happens in the frontend)
ALTER TABLE public.reservations ADD CONSTRAINT reservations_package_type_check 
CHECK (package_type IS NOT NULL AND length(package_type) > 0);