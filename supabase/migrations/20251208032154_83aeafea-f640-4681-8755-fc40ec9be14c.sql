-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;

-- Create a PERMISSIVE INSERT policy that allows anyone to submit reservations
CREATE POLICY "Anyone can submit reservation" 
ON public.reservations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);