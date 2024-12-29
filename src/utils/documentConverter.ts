import { supabase } from '@/integrations/supabase/client';

export const convertDocToDocx = async (file: File): Promise<File> => {
  try {
    console.log('Starting document conversion for file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.functions.invoke('convert-document', {
      body: formData,
    });

    if (error) {
      console.error('Document conversion error:', error);
      throw error;
    }

    // Create a new file from the response blob
    const blob = new Blob([data], { type: 'application/pdf' });
    return new File([blob], file.name.replace(/\.[^/.]+$/, '.pdf'), { 
      type: 'application/pdf'
    });
  } catch (error) {
    console.error('Conversion error:', error);
    throw error instanceof Error ? error : new Error('Failed to convert document');
  }
};