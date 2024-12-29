import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      console.error('Invalid request method:', req.method)
      return new Response(
        JSON.stringify({ error: 'Only POST requests are allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API key
    const apiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
    if (!apiKey) {
      console.error('Missing API key')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get and validate form data
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      console.error('Invalid or missing file in request')
      return new Response(
        JSON.stringify({ error: 'No valid file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`)

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Create form data for Unstructured API
    const unstructuredFormData = new FormData()
    unstructuredFormData.append('files', new Blob([arrayBuffer], { type: file.type }), file.name)
    unstructuredFormData.append('strategy', 'fast')
    unstructuredFormData.append('output_format', 'text')

    // Call Unstructured API directly
    console.log('Calling Unstructured API...')
    const unstructuredResponse = await fetch('https://api.unstructured.io/general/v0/general', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'unstructured-api-key': apiKey
      },
      body: unstructuredFormData
    })

    if (!unstructuredResponse.ok) {
      const errorText = await unstructuredResponse.text()
      console.error('Unstructured API error:', errorText)
      throw new Error(`Unstructured API error: ${unstructuredResponse.status} ${errorText}`)
    }

    const elements = await unstructuredResponse.json()
    console.log('Document processing complete')

    // Return successful response
    return new Response(
      JSON.stringify({ 
        elements,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing document:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})