-- Drop existing policies on reservations table
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can update all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;
DROP POLICY IF EXISTS "Users view own reservations" ON public.reservations;

-- Create PERMISSIVE INSERT policy - anyone can submit reservations
CREATE POLICY "Anyone can submit reservation" 
ON public.reservations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create PERMISSIVE SELECT policy - admins can view all
CREATE POLICY "Admins can view all reservations" 
ON public.reservations 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE SELECT policy - users can view their own reservations by email
CREATE POLICY "Users can view own reservations" 
ON public.reservations 
FOR SELECT 
TO authenticated
USING (email = (auth.jwt() ->> 'email'::text));

-- Create PERMISSIVE UPDATE policy - admins only
CREATE POLICY "Admins can update reservations" 
ON public.reservations 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE DELETE policy - admins only
CREATE POLICY "Admins can delete reservations" 
ON public.reservations 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));