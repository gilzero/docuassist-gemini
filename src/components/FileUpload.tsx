import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { DropzoneContent } from './DropzoneContent';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(fileType || '')) {
      toast.error('Please upload a .pdf, .docx, .doc, or .txt file');
      return;
    }

    try {
      onFileSelect(file);
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process file');
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-10 transition-all duration-300',
        'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
        'shadow-sm hover:shadow-md',
        isDragActive ? 'border-primary bg-primary/5 scale-102' : 'border-gray-300 dark:border-gray-600',
        isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50',
        'group'
      )}
    >
      <input {...getInputProps()} disabled={isProcessing} />
      <div className="flex flex-col items-center gap-6 text-center">
        <DropzoneContent isProcessing={isProcessing} isConverting={false} />
      </div>
    </div>
  );
};