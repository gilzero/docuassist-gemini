import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('No valid file uploaded');
    }

    // We'll just pass through PDF and DOCX files
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'doc') {
      throw new Error('Legacy .doc files are not supported. Please convert to .docx');
    }

    if (!['pdf', 'docx'].includes(fileType || '')) {
      throw new Error('Unsupported file type. Only .pdf and .docx files are supported');
    }

    // Return the file as-is
    return new Response(file, {
      headers: {
        ...corsHeaders,
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
    });

  } catch (error) {
    console.error('Document processing error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
})