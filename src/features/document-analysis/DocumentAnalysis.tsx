import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUploadZone } from './components/FileUploadZone';
import { AnalysisOutput } from './components/AnalysisOutput';
import { EmptyAnalysis } from './components/EmptyAnalysis';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const DocumentAnalysis = () => {
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
      setUploadProgress(Math.round((i / pdf.numPages) * 100));
    }
    
    return text;
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    setUploadProgress(100);
    return result.value;
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      let text = '';
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'pdf') {
        text = await extractTextFromPDF(file);
      } else if (fileType === 'docx') {
        text = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }

      if (!text.trim()) {
        throw new Error('No text content could be extracted from the file');
      }

      const analysis = await analyzeDocument(text, file.name);
      setResponse(analysis);
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
