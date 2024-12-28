import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (!['docx', 'pdf'].includes(fileType || '')) {
        toast.error('Please upload a .docx or .pdf file');
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-lg border-2 border-dashed p-8 transition-all duration-200
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 dark:border-gray-600'
        }
        ${isProcessing 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:border-primary/50'
        }
      `}
    >
      <input {...getInputProps()} disabled={isProcessing} />
      <div className="flex flex-col items-center gap-4 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">Processing document...</p>
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
              <span>Supports .docx and .pdf</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};