import { supabase } from "@/integrations/supabase/client";

export async function analyzeDocument(fileContent: string, fileName: string) {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { fileContent, fileName }
    });

    if (error) {
      console.error('Error calling analyze-document function:', error);
      throw error;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data.text;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
}