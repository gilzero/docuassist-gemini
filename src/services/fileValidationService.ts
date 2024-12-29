import { toast } from 'sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    };
  }

  // Check file type
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'doc') {
    return {
      isValid: false,
      error: 'Legacy .doc files are not supported. Please convert to .docx first'
    };
  }
  
  if (!['pdf', 'docx'].includes(fileType || '')) {
    return {
      isValid: false,
      error: 'Please upload a .docx or .pdf file'
    };
  }

  return { isValid: true };
}