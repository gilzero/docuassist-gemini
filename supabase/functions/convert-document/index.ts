import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFServicesSdk } from 'npm:@adobe/pdfservices-node-sdk'

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
    console.log('Starting document conversion process')
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      throw new Error('No valid file uploaded')
    }

    console.log('Processing file:', file.name)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    console.log('Initializing Adobe PDF Services')
    const credentials = PDFServicesSdk.Credentials
      .servicePrincipalCredentialsBuilder()
      .withClientId(Deno.env.get('PDF_SERVICES_CLIENT_ID'))
      .withClientSecret(Deno.env.get('PDF_SERVICES_CLIENT_SECRET'))
      .build()

    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials)
    const operation = PDFServicesSdk.CreatePDF.Operation.createNew()

    // Create a temporary file from the buffer
    const tempFile = await Deno.makeTempFile()
    await Deno.writeFile(tempFile, buffer)

    // Set up the input word document
    const input = PDFServicesSdk.FileRef.createFromLocalFile(
      tempFile,
      PDFServicesSdk.CreatePDF.SupportedSourceFormat.DOC
    )
    operation.setInput(input)

    // Execute the operation
    console.log('Executing conversion operation')
    const result = await operation.execute(executionContext)
    
    // Get the converted content
    const convertedContent = await result.getContent()

    // Clean up the temporary file
    await Deno.remove(tempFile)

    console.log('Conversion successful')
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: convertedContent,
        message: 'Document converted successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Conversion error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to convert document',
        details: error.stack
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})