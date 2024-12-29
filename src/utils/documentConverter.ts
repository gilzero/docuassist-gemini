import { supabase } from '@/integrations/supabase/client';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    // For .doc files, use Adobe PDF Services API
    if (docFile.name.toLowerCase().endsWith('.doc')) {
      const formData = new FormData();
      formData.append('file', docFile);

      const { data, error } = await supabase.functions.invoke('convert-document', {
        body: formData,
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Conversion failed');

      // Create a new file with the converted content
      const convertedBlob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      return new File([convertedBlob], docFile.name.replace('.doc', '.docx'), { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
    }
    
    // For .docx files, use existing mammoth conversion
    const arrayBuffer = await docFile.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const plainText = result.value;
    
    // Create a new file with the converted content
    const blob = new Blob([plainText], { type: 'text/plain' });
    return new File([blob], docFile.name.replace('.docx', '.txt'), { 
      type: 'text/plain' 
    });
  } catch (error) {
    console.error('Conversion error:', error);
    throw error instanceof Error ? error : new Error('Failed to convert document');
  }
};