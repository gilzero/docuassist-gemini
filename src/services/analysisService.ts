import { supabase } from '@/integrations/supabase/client';

export async function analyzeDocument(text: string, fileName: string): Promise<string> {
  try {
    console.log('Starting document analysis for:', fileName);
    
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { fileContent: text, fileName }
    });

    if (error) {
      console.error('Analysis error:', error);
      throw error;
    }

    if (!data?.text) {
      throw new Error('No analysis text returned');
    }

    return data.text;
  } catch (error) {
    console.error('Error in document analysis:', error);
    throw error;
  }
}