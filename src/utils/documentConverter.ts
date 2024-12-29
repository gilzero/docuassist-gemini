import mammoth from 'mammoth';
import { MarkItDown } from 'markitdown';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    const arrayBuffer = await docFile.arrayBuffer();
    
    // For .doc files, use MarkItDown
    if (docFile.name.toLowerCase().endsWith('.doc')) {
      const md = new MarkItDown();
      const result = await md.convert(new Blob([arrayBuffer]));
      const plainText = result.text_content;
      
      // Create a new file with the converted content
      const blob = new Blob([plainText], { type: 'text/plain' });
      return new File([blob], docFile.name.replace('.doc', '.txt'), { type: 'text/plain' });
    }
    
    // For .docx files, use mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const plainText = result.value;
    
    // Create a new file with the converted content
    const blob = new Blob([plainText], { type: 'text/plain' });
    return new File([blob], docFile.name.replace('.docx', '.txt'), { type: 'text/plain' });
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert document. Please ensure the file is a valid .doc or .docx file.');
  }
};