import * as docx from 'docx-wasm';

export const convertDocToDocx = async (docFile: File): Promise<File> => {
  try {
    // Initialize docx-wasm
    const wasm = await docx;
    await wasm.init?.();
    
    const arrayBuffer = await docFile.arrayBuffer();
    const doc = await wasm.Document.load(new Uint8Array(arrayBuffer));
    const docxBuffer = await doc.saveAsDocx();
    
    // Create a new file with the converted content
    const convertedFile = new File(
      [docxBuffer],
      docFile.name.replace('.doc', '.docx'),
      { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    );
    
    return convertedFile;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert .doc file');
  }
};