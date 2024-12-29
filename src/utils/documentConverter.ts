import mammoth from 'mammoth';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    // For .doc files, throw a specific error
    if (docFile.name.toLowerCase().endsWith('.doc')) {
      throw new Error('Legacy .doc files are not supported. Please convert to .docx');
    }
    
    // For .docx files, use mammoth
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