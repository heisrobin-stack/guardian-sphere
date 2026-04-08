import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('SECURITYTRAILS_API_KEY')
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'SecurityTrails API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { domain } = await req.json()
    if (!domain || typeof domain !== 'string') {
      return new Response(JSON.stringify({ error: 'Domain parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(`https://api.securitytrails.com/v1/domain/${encodeURIComponent(domain)}`, {
      headers: {
        'APIKEY': API_KEY,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(`SecurityTrails API error [${response.status}]: ${JSON.stringify(data)}`)
    }

    // Also fetch subdomains
    const subsResponse = await fetch(`https://api.securitytrails.com/v1/domain/${encodeURIComponent(domain)}/subdomains`, {
      headers: { 'APIKEY': API_KEY },
    })
    const subsData = await subsResponse.json()

    return new Response(JSON.stringify({ domain: data, subdomains: subsData }), {
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
