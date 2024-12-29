import React from 'react';
import { Upload, FileText, Loader2, Server } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropzoneContentProps {
  isProcessing: boolean;
  isConverting: boolean;
}

export const DropzoneContent = ({ isProcessing, isConverting }: DropzoneContentProps) => {
  const isDisabled = isProcessing || isConverting;

  if (isDisabled) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="space-y-2">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {isConverting ? 'Converting document...' : 'Processing document...'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This may take a few moments
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Server className="h-3 w-3" />
            <span>Processing in Singapore region</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative">
          <Upload className="h-12 w-12 text-primary transition-transform group-hover:scale-110 duration-300" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          Drag & drop your document here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or click to select a file
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
        <FileText className="h-4 w-4" />
        <span>Supports .doc, .docx, and .pdf</span>
      </div>
    </motion.div>
  );
};