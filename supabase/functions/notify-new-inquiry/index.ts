import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders as baseCors } from 'npm:@supabase/supabase-js@2/cors'
import { verifyWebhookSecret } from '../_shared/webhook-auth.ts'

const corsHeaders = {
  ...baseCors,
  'Access-Control-Allow-Headers':
    (baseCors as Record<string, string>)['Access-Control-Allow-Headers']
      ? `${(baseCors as Record<string, string>)['Access-Control-Allow-Headers']}, x-webhook-secret`
      : 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!(await verifyWebhookSecret(req))) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = await req.json().catch(() => ({}))
    const recordId = body?.record?.id

    if (!recordId || typeof recordId !== 'string') {
      return new Response(JSON.stringify({ error: 'invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Re-fetch the row server-side so we can't be tricked into sending
    // attacker-controlled content (the trigger payload is technically
    // user-influenced via the original form submission).
    const { data: record, error: fetchError } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, message')
      .eq('id', recordId)
      .single()

    if (fetchError || !record) {
      return new Response(JSON.stringify({ error: 'inquiry not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1) Customer confirmation. send-transactional-email re-reads the row
    //    using inquiryId, so caller-supplied templateData is ignored for
    //    this template — we only need to pass the id and recipient.
    const { error: customerErr } = await supabase.functions.invoke(
      'send-transactional-email',
      {
        body: {
          templateName: 'inquiry-confirmation',
          recipientEmail: record.email,
          inquiryId: record.id,
          idempotencyKey: `inquiry-confirm-${record.id}`,
        },
      },
    )
    if (customerErr) console.error('Customer inquiry email enqueue failed:', customerErr)

    // 2) Admin notification — recipient is fixed by the template (`to: veronika@…`).
    const { error: adminErr } = await supabase.functions.invoke(
      'send-transactional-email',
      {
        body: {
          templateName: 'inquiry-admin-notification',
          inquiryId: record.id,
          idempotencyKey: `inquiry-admin-${record.id}`,
        },
      },
    )
    if (adminErr) console.error('Admin inquiry email enqueue failed:', adminErr)

    return new Response(
      JSON.stringify({
        success: true,
        customerError: customerErr?.message ?? null,
        adminError: adminErr?.message ?? null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in notify-new-inquiry:', error)
    return new Response(JSON.stringify({ error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
