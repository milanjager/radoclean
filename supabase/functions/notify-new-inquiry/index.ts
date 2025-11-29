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
    const { record } = await req.json()
    
    console.log('New inquiry received:', record)

    const { error } = await resend.emails.send({
      from: 'RadoClean Inquiries <onboarding@resend.dev>',
      to: ['nango.design@gmail.com'], // Admin email
      subject: `New Contact Form Inquiry from ${record.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${record.message}</p>
        <p><strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString('cs-CZ')}</p>
        <hr/>
        <p>Log in to your admin dashboard to respond: <a href="https://xeogwgtqbgpthfpxoofw.lovable.app/admin">View Dashboard</a></p>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email notification sent successfully')

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in notify-new-inquiry:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
