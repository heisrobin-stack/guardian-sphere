import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('ZOOMEYE_API_KEY')
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'ZoomEye API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { query, type } = await req.json()
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const searchType = type === 'web' ? 'web' : 'host'
    const response = await fetch(`https://api.zoomeye.org/${searchType}/search?query=${encodeURIComponent(query)}&page=1`, {
      headers: {
        'API-KEY': API_KEY,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(`ZoomEye API error [${response.status}]: ${JSON.stringify(data)}`)
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
