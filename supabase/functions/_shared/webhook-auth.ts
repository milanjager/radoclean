import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

let cachedSecret: string | null = null

export async function verifyWebhookSecret(req: Request): Promise<boolean> {
  const provided = req.headers.get('x-webhook-secret')
  if (!provided) return false

  if (!cachedSecret) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data, error } = await supabase
      .from('app_secrets')
      .select('value')
      .eq('key', 'webhook_secret')
      .single()
    if (error || !data?.value) return false
    cachedSecret = data.value
  }

  // constant-time-ish compare
  if (provided.length !== cachedSecret.length) return false
  let mismatch = 0
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ cachedSecret.charCodeAt(i)
  }
  return mismatch === 0
}
