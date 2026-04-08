import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const CENSYS_API_ID = Deno.env.get('CENSYS_API_ID')
    const CENSYS_API_SECRET = Deno.env.get('CENSYS_API_SECRET')

    if (!CENSYS_API_ID || !CENSYS_API_SECRET) {
      return new Response(JSON.stringify({ error: 'Censys API credentials not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { query, page } = await req.json()
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const authHeader = btoa(`${CENSYS_API_ID}:${CENSYS_API_SECRET}`)
    const response = await fetch('https://search.censys.io/api/v2/hosts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        per_page: 10,
        page: page || 1,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Censys API error [${response.status}]: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
