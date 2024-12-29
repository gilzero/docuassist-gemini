import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUploadZone } from './components/FileUploadZone';
import { AnalysisOutput } from './components/AnalysisOutput';
import { EmptyAnalysis } from './components/EmptyAnalysis';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const DocumentAnalysis = () => {
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processDocument = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData,
    });

    if (error) throw error;
    if (!data?.elements) throw new Error('No text content could be extracted from the file');

    // Convert elements to text
    return data.elements
      .map(element => element.text)
      .join('\n');
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      setUploadProgress(25);
      const text = await processDocument(file);
      
      setUploadProgress(50);
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
      <FileUploadZone 
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
        error={error}
        uploadProgress={uploadProgress}
      />

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg h-[calc(100vh-16rem)] min-h-[500px]"
        role="region"
        aria-label="Analysis Results"
      >
        {response ? (
          <AnalysisOutput response={response} />
        ) : (
          <EmptyAnalysis />
        )}
      </motion.div>
    </motion.main>
  );
};