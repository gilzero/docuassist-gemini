import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { init, WordDocument } from 'docx-wasm';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const convertDocToDocx = async (docFile: File): Promise<File> => {
    setIsConverting(true);
    try {
      // Initialize docx-wasm
      await init();
      
      const arrayBuffer = await docFile.arrayBuffer();
      const doc = await WordDocument.load(new Uint8Array(arrayBuffer));
      const docxBuffer = await doc.saveAsDocx();
      
      // Create a new file with the converted content
      const convertedFile = new File(
        [docxBuffer],
        docFile.name.replace('.doc', '.docx'),
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      );
      
      toast.success('Successfully converted .doc to .docx');
      return convertedFile;
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert .doc file. Please try uploading a .docx file instead.');
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }

      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (!['doc', 'docx', 'pdf'].includes(fileType || '')) {
        toast.error('Please upload a .doc, .docx, or .pdf file');
        return;
      }

      try {
        // If it's a .doc file, convert it first
        if (fileType === 'doc') {
          const convertedFile = await convertDocToDocx(file);
          onFileSelect(convertedFile);
        } else {
          onFileSelect(file);
        }
      } catch (error) {
        console.error('File processing error:', error);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const isDisabled = isProcessing || isConverting;

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-lg border-2 border-dashed p-8 transition-all duration-200
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 dark:border-gray-600'
        }
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:border-primary/50'
        }
      `}
    >
      <input {...getInputProps()} disabled={isDisabled} />
      <div className="flex flex-col items-center gap-4 text-center">
        {isDisabled ? (
          <>
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isConverting ? 'Converting document...' : 'Processing document...'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-primary" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drag & drop your document here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to select a file
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>Supports .doc, .docx, and .pdf</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};