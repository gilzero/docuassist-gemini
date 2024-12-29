import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getAdobeAccessToken(clientId: string, clientSecret: string) {
  console.log('Getting Adobe access token...');
  
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', clientId);
  formData.append('client_secret', clientSecret);
  
  const response = await fetch('https://pdf-services.adobe.io/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    console.error('Failed to get Adobe token:', await response.text());
    throw new Error('Failed to get Adobe access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function convertToPDF(file: File, token: string, clientId: string) {
  console.log('Starting PDF conversion...');
  
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://pdf-services.adobe.io/operation/createpdf', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': clientId,
    },
    body: formData,
  });

  if (!response.ok) {
    console.error('PDF conversion failed:', await response.text());
    throw new Error('PDF conversion failed');
  }

  return await response.blob();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting document conversion process');
    const clientId = Deno.env.get('PDF_SERVICES_CLIENT_ID');
    const clientSecret = Deno.env.get('PDF_SERVICES_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Adobe credentials not configured');
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('No valid file uploaded');
    }

    console.log('File received:', file.name);

    // Get Adobe access token
    const token = await getAdobeAccessToken(clientId, clientSecret);
    console.log('Got Adobe access token');

    // Convert the document
    const pdfBlob = await convertToPDF(file, token, clientId);
    console.log('Conversion successful');

    return new Response(pdfBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^/.]+$/, '')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
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