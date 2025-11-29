import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { record } = await req.json()
    
    console.log('New chat message received:', record)

    // Get conversation details
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('visitor_name, visitor_email')
      .eq('id', record.conversation_id)
      .single()

    if (!conversation) {
      console.log('Conversation not found')
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Only notify for visitor messages
    if (record.sender_type === 'visitor') {
      const { error } = await resend.emails.send({
        from: 'RadoClean Chat <onboarding@resend.dev>',
        to: ['nango.design@gmail.com'], // Admin email
        subject: `New Chat Message from ${conversation.visitor_name || 'Visitor'}`,
        html: `
          <h2>New Chat Message Received</h2>
          <p><strong>From:</strong> ${conversation.visitor_name || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${conversation.visitor_email || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${record.message}</p>
          <p><strong>Time:</strong> ${new Date(record.created_at).toLocaleString('cs-CZ')}</p>
          <hr/>
          <p>Log in to your admin dashboard to respond: <a href="https://xeogwgtqbgpthfpxoofw.lovable.app/admin">View Dashboard</a></p>
        `,
      })

      if (error) {
        console.error('Error sending email:', error)
        throw error
      }

      console.log('Email notification sent successfully')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in notify-new-chat:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
