-- Grant INSERT permission to anon and authenticated roles on reservations table
GRANT INSERT ON public.reservations TO anon;
GRANT INSERT ON public.reservations TO authenticated;

-- Also ensure SELECT is granted for the insert to return data
GRANT SELECT ON public.reservations TO anon;
GRANT SELECT ON public.reservations TO authenticated;