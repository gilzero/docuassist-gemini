import React from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface DropzoneContentProps {
  isProcessing: boolean;
  isConverting: boolean;
}

export const DropzoneContent = ({ isProcessing, isConverting }: DropzoneContentProps) => {
  const isDisabled = isProcessing || isConverting;

  if (isDisabled) {
    return (
      <>
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {isConverting ? 'Converting document...' : 'Processing document...'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This may take a few moments
        </p>
      </>
    );
  }

  return (
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
  );
};