import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFServicesSdk } from 'npm:@adobe/pdfservices-node-sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    const credentials = PDFServicesSdk.Credentials
      .servicePrincipalCredentialsBuilder()
      .withClientId(Deno.env.get('PDF_SERVICES_CLIENT_ID'))
      .withClientSecret(Deno.env.get('PDF_SERVICES_CLIENT_SECRET'))
      .build()

    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials)
    const operation = PDFServicesSdk.ExportPDF.Operation.createNew()

    // If it's a DOC file, we'll convert it to DOCX first
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (fileExt === 'doc') {
      operation.setInput(file)
      operation.setOptions(PDFServicesSdk.ExportPDF.options.docx())
      
      const result = await operation.execute(executionContext)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'File converted successfully',
          data: result 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Unsupported file type')
  } catch (error) {
    console.error('Document conversion error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to convert document' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})