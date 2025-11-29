-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete feedback
CREATE POLICY "Admins can delete feedback"
  ON public.feedback
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));