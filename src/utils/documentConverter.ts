import mammoth from 'mammoth';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    // Read the file content
    const arrayBuffer = await docFile.arrayBuffer();
    
    // Convert DOC to HTML first using mammoth
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // Convert the HTML to plain text (removing HTML tags)
    const plainText = result.value.replace(/<[^>]*>/g, ' ').trim();
    
    // Create a new Blob with the text content
    const blob = new Blob([plainText], { type: 'text/plain' });
    
    // Create a new file with the converted content
    const convertedFile = new File(
      [blob],
      docFile.name.replace('.doc', '.txt'),
      { type: 'text/plain' }
    );
    
    return convertedFile;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert .doc file. Please try uploading a .docx file instead.');
  }
};