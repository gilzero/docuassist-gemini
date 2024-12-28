import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

let GEMINI_API_KEY: string | null = null;

async function getGeminiApiKey() {
  if (GEMINI_API_KEY) return GEMINI_API_KEY;
  
  const { data, error } = await supabase.functions.invoke('get-secret', {
    body: { secretName: 'VITE_GEMINI_API_KEY' }
  });
  
  if (error || !data?.secret) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your project settings.');
  }
  
  GEMINI_API_KEY = data.secret;
  return GEMINI_API_KEY;
}

export async function analyzeDocument(fileContent: string, fileName: string) {
  try {
    const apiKey = await getGeminiApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
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
    return response.text();
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
}