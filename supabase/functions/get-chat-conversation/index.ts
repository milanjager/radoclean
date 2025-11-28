import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const { visitorId } = await req.json()
    
    if (!visitorId) {
      return new Response(
        JSON.stringify({ error: 'Visitor ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch conversation for this visitor
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('visitor_id', visitorId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
