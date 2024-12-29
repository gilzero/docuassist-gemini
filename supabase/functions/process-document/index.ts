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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const apiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
    if (!apiKey) {
      throw new Error('Unstructured API key not configured')
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
          maxInterval: 60000,
          exponent: 1.5,
          maxElapsedTime: 60000, // Reduced to 1 minute
        },
      }
    })

    // Get the file data from the request
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      console.error('Invalid file provided')
      return new Response(
        JSON.stringify({ error: 'No valid file provided' }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`)

    // Convert File to Uint8Array for processing
    const arrayBuffer = await file.arrayBuffer()
    const content = new Uint8Array(arrayBuffer)

    console.log('Starting Unstructured.io processing...')

    // Process the document
    const response = await client.general.partition({
      partitionParameters: {
        files: {
          content,
          fileName: file.name,
        },
        strategy: Strategy.HiRes,
        splitPdfPage: true,
        splitPdfAllowFailed: true,
        splitPdfConcurrencyLevel: 5, // Reduced for stability
        languages: ['eng'],
        coordinates: true,
        includePageBreaks: true,
        uniqueElementIds: true
      }
    })

    console.log('Unstructured.io processing complete')

    if (!response.elements || response.statusCode !== 200) {
      console.error('Processing failed:', response)
      throw new Error('Failed to process document')
    }

    return new Response(
      JSON.stringify({ elements: response.elements }),
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