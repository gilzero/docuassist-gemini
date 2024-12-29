import React from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UploadProgress } from '@/components/UploadProgress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
  uploadProgress: number;
}

export const FileUploadZone = ({ 
  onFileSelect, 
  isProcessing, 
  error, 
  uploadProgress 
}: FileUploadZoneProps) => {
  return (
    <div className="space-y-6">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
      >
        <FileUpload onFileSelect={onFileSelect} isProcessing={isProcessing} />
      </motion.div>
      
      {uploadProgress > 0 && !isProcessing && (
        <div role="progressbar" 
             aria-valuenow={uploadProgress} 
             aria-valuemin={0} 
             aria-valuemax={100}
        >
          <UploadProgress progress={uploadProgress} />
        </div>
      )}
      
      {error && (
        <Alert 
          variant="destructive" 
          className="animate-in slide-in-from-top-5"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};