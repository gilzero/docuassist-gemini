import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProcessedDocument {
  elements: Array<{
    type: string;
    text: string;
    metadata?: Record<string, any>;
  }>;
}

export async function processDocument(file: File): Promise<string> {
  try {
    console.log('Starting document processing for:', file.name);
    
    // Create form data for the file
    const formData = new FormData();
    formData.append('file', file);

    // Process the document using Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData,
    });

    if (error) {
      console.error('Document processing error:', error);
      throw error;
    }

    if (!data?.elements) {
      throw new Error('No elements returned from document processing');
    }

    // Convert elements to text format suitable for analysis
    const text = data.elements
      .map(element => element.text)
      .join('\n');

    return text;
  } catch (error) {
    console.error('Error in document processing:', error);
    throw error;
  }
}