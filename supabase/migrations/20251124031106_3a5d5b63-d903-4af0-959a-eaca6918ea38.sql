-- Fix critical RLS vulnerability on reservations table
-- Remove the policy with 'OR true' that exposes all customer data
DROP POLICY IF EXISTS "Users can view their own reservations by email" ON public.reservations;

-- Create secure policy for authenticated users to view only their own reservations
CREATE POLICY "Users view own reservations" ON public.reservations
FOR SELECT 
TO authenticated
USING (email = (auth.jwt()->>'email'));

-- Note: Admin policy "Admins can view all reservations" already exists and is secure