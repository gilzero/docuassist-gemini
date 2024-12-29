import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { UnstructuredClient } from "npm:unstructured-client"
import { Strategy } from "npm:unstructured-client/sdk/models/shared"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  console.log('Received request:', req.method, req.url)
  
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
        { status: 405, headers: corsHeaders }
      )
    }

    // Get API key
    const apiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
    if (!apiKey) {
      console.error('Missing API key')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      )
    }

    console.log('Initializing Unstructured client...')
    const client = new UnstructuredClient({
      serverURL: 'https://api.unstructured.io/general/v0/general',
      security: {
        apiKeyAuth: apiKey,
      },
      retryConfig: {
        strategy: "backoff",
        retryConnectionErrors: true,
        backoff: {
          initialInterval: 500,
          maxInterval: 30000,
          exponent: 1.5,
          maxElapsedTime: 30000, // Reduced to 30 seconds
        },
      }
    })

    // Get and validate form data
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      console.error('Invalid or missing file in request')
      return new Response(
        JSON.stringify({ error: 'No valid file provided' }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`)

    // Convert File to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const content = new Uint8Array(arrayBuffer)

    console.log('Starting document processing...')
    
    // Process the document with reduced complexity settings
    const response = await client.general.partition({
      partitionParameters: {
        files: {
          content,
          fileName: file.name,
        },
        strategy: Strategy.Fast, // Changed to Fast for better reliability
        splitPdfPage: true,
        splitPdfAllowFailed: true,
        splitPdfConcurrencyLevel: 2, // Reduced for stability
        languages: ['eng'],
        coordinates: false, // Disabled for performance
        includePageBreaks: true,
        uniqueElementIds: true
      }
    })

    console.log('Document processing complete')

    if (!response.elements || response.statusCode !== 200) {
      console.error('Processing failed:', response)
      return new Response(
        JSON.stringify({ error: 'Failed to process document', details: response }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        elements: response.elements,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error processing document:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
})