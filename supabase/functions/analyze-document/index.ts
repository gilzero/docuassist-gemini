import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get server location information
    const locationResponse = await fetch('http://ipapi.co/json/');
    const locationData = await locationResponse.json();
    console.log('Server Location:', {
      city: locationData.city,
      region: locationData.region,
      country: locationData.country_name
    });

    const apiKey = Deno.env.get('VITE_GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const { fileContent, fileName } = await req.json();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As a professional editor, I require your assistance with a detailed analysis of the attached document. Please perform the following tasks:
1. Summarization: Provide a concise summary of the document's main points, emphasizing key events, characters, and themes.
2. Character Analysis: Examine the primary characters, focusing on their motivations, relationships, and development throughout the story. Highlight character arcs, conflicts, and notable traits.
3. Plot Analysis: Deconstruct the plot into its key components: exposition, rising action, climax, falling action, and resolution. Identify plot twists, turning points, and any pacing issues.
4. Thematic Analysis: Analyze the document's dominant themes, including symbolism, motifs, and recurring ideas. Explain how these themes evolve and are integrated into the narrative.
5. Readability Assessment: Assess the document's readability, addressing sentence structure, vocabulary, and overall clarity. Offer suggestions for improvement if needed.
6. Sentiment Analysis: Evaluate the tone and sentiment of the document, noting emotional shifts or inconsistencies. Determine the overall sentiment and its effect on the reader.
7. Style and Consistency Check: Review the writing style, tone, and consistency. Identify and suggest corrections for any inconsistencies or unclear elements.  

Output the analysis in Chinese, as the intended audience is the publisher's chief editor. Organize the analysis clearly and systematically for easy reference.

Guidelines:
- Assume the document is a work of fiction unless specified otherwise.
- Prioritize the narrative and literary aspects of the document, disregarding technical or factual accuracy.
- Maintain a formal and objective tone, avoiding personal opinions or biases.

Document content: ${fileContent}
Filename: ${fileName}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return new Response(JSON.stringify({ 
      text: response.text(),
      serverLocation: locationData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});