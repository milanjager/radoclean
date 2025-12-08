-- Drop ALL existing policies on reservations to start fresh
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservations;

-- Ensure proper schema and table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.reservations TO anon, authenticated;

-- Recreate INSERT policy - explicitly PERMISSIVE (default) for public role
CREATE POLICY "Anyone can submit reservation" 
ON public.reservations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Recreate SELECT policies
CREATE POLICY "Admins can view all reservations" 
ON public.reservations 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own reservations" 
ON public.reservations 
FOR SELECT 
TO authenticated
USING (email = (auth.jwt() ->> 'email'::text));

-- Recreate UPDATE policy
CREATE POLICY "Admins can update reservations" 
ON public.reservations 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recreate DELETE policy
CREATE POLICY "Admins can delete reservations" 
ON public.reservations 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));