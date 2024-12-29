import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getAdobeAccessToken() {
  console.log('Getting Adobe access token...');
  const clientId = Deno.env.get('PDF_SERVICES_CLIENT_ID');
  const clientSecret = Deno.env.get('PDF_SERVICES_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('Adobe credentials not configured');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('scope', 'openid,AdobeID,read_organizations');
    
    const response = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Adobe token response not OK:', response.status, errorText);
      throw new Error(`Adobe token request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully obtained Adobe access token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting Adobe token:', error);
    throw new Error(`Failed to get Adobe access token: ${error.message}`);
  }
}

async function convertToPDF(file: File, token: string) {
  console.log('Starting PDF conversion...', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  });
  
  try {
    const formData = new FormData();
    
    // Create a new blob with the correct content type for Word documents
    let contentType;
    if (file.name.endsWith('.doc')) {
      contentType = 'application/msword';
    } else if (file.name.endsWith('.docx')) {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      throw new Error('Unsupported file type. Only .doc and .docx files are supported.');
    }
    
    // Create a new blob with the correct content type
    const blob = new Blob([await file.arrayBuffer()], { type: contentType });
    const newFile = new File([blob], file.name, { type: contentType });
    
    formData.append('file', newFile);

    console.log('Sending request to Adobe PDF Services API...');
    
    const response = await fetch('https://pdf-services.adobe.io/operation/createpdf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': Deno.env.get('PDF_SERVICES_CLIENT_ID') || '',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PDF conversion failed:', response.status, errorText);
      throw new Error(`PDF conversion failed with status ${response.status}: ${errorText}`);
    }

    console.log('Successfully converted file to PDF');
    return await response.blob();
  } catch (error) {
    console.error('Error converting to PDF:', error);
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting document conversion process');
    
    // Get the uploaded file from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No valid file uploaded');
      throw new Error('No valid file uploaded');
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Get Adobe access token
    const token = await getAdobeAccessToken();
    
    // Convert the document
    const pdfBlob = await convertToPDF(file, token);

    // Return the converted PDF
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