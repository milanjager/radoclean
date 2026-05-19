CREATE TABLE public.gsc_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  payload jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_gsc_snapshots_kind_fetched ON public.gsc_snapshots(kind, fetched_at DESC);

ALTER TABLE public.gsc_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view gsc snapshots"
ON public.gsc_snapshots
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));