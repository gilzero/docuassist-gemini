import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { UnstructuredClient } from "npm:unstructured-client"
import { Strategy } from "npm:unstructured-client/sdk/models/shared"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
    if (!apiKey) {
      throw new Error('Unstructured API key not configured')
    }

    // Initialize the Unstructured client
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
          maxElapsedTime: 900000, // 15 minutes
        },
      }
    })

    // Get the file data from the request
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    // Convert File to Uint8Array for processing
    const arrayBuffer = await file.arrayBuffer()
    const content = new Uint8Array(arrayBuffer)

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
        splitPdfConcurrencyLevel: 15,
        languages: ['eng'],
        coordinates: true,
        includePageBreaks: true,
        uniqueElementIds: true
      }
    })

    if (response.statusCode !== 200) {
      throw new Error('Failed to process document')
    }

    return new Response(
      JSON.stringify({ elements: response.elements }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})