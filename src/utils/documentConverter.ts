import * as docx from 'docx-wasm';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    const arrayBuffer = await docFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Create a new file with the converted content
    const convertedFile = new File(
      [uint8Array],
      docFile.name.replace('.doc', '.docx'),
      { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    );
    
    return convertedFile;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert .doc file');
  }
};