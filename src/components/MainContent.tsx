import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ResponseDisplay } from './ResponseDisplay';
import { UploadProgress } from './UploadProgress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { analyzeDocument } from '@/lib/gemini';
import { supabase } from '@/integrations/supabase/client';
import { EmptyAnalysis } from './EmptyAnalysis';

export const MainContent = () => {
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Create form data for the file
      const formData = new FormData();
      formData.append('file', file);

      // Process the document using Unstructured.io via Edge Function
      const { data, error: processError } = await supabase.functions.invoke('process-document', {
        body: formData,
      });

      if (processError) throw processError;
      if (!data?.elements) throw new Error('No text content could be extracted from the file');

      setUploadProgress(50);

      // Convert elements to text
      const text = data.elements
        .map(element => element.text)
        .join('\n');

      // Analyze the processed text
      const analysis = await analyzeDocument(text, file.name);
      setResponse(analysis);
      setUploadProgress(100);
      
      toast.success('Document analysis complete');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process document';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Document processing error:', error);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.main 
      role="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid lg:grid-cols-2 gap-8"
      aria-label="Document Upload and Analysis Section"
    >
      <div className="space-y-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
        >
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
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

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg h-[calc(100vh-16rem)] min-h-[500px]"
        role="region"
        aria-label="Analysis Results"
      >
        {response ? (
          <ResponseDisplay response={response} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <EmptyAnalysis />
          </div>
        )}
      </motion.div>
    </motion.main>
  );
};