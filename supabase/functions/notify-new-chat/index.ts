import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { verifyWebhookSecret } from '../_shared/webhook-auth.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
}

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

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

    // Re-fetch the row from the DB instead of trusting caller-supplied content.
    const { data: record, error: fetchError } = await supabase
      .from('chat_messages')
      .select('id, conversation_id, sender_type, message, created_at')
      .eq('id', recordId)
      .single()

    if (fetchError || !record) {
      return new Response(JSON.stringify({ error: 'message not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (record.sender_type !== 'visitor') {
      return new Response(JSON.stringify({ success: true, skipped: 'not_visitor' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('visitor_name, visitor_email')
      .eq('id', record.conversation_id)
      .single()

    if (!conversation) {
      return new Response(JSON.stringify({ error: 'conversation not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error } = await resend.emails.send({
      from: 'RadoClean Chat <onboarding@resend.dev>',
      to: ['veronika@radoclean.cz'],
      cc: ['soused@radoclean.cz'],
      subject: `New Chat Message from ${esc(conversation.visitor_name || 'Visitor')}`,
      html: `
        <h2>New Chat Message Received</h2>
        <p><strong>From:</strong> ${esc(conversation.visitor_name || 'Anonymous')}</p>
        <p><strong>Email:</strong> ${esc(conversation.visitor_email || 'Not provided')}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(record.message)}</p>
        <p><strong>Time:</strong> ${esc(new Date(record.created_at).toLocaleString('cs-CZ'))}</p>
        <hr/>
        <p>Log in to your admin dashboard to respond: <a href="https://xeogwgtqbgpthfpxoofw.lovable.app/admin">View Dashboard</a></p>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in notify-new-chat:', error)
    return new Response(JSON.stringify({ error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
