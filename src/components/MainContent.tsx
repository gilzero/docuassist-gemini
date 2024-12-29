import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ResponseDisplay } from './ResponseDisplay';
import { UploadProgress } from './UploadProgress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { processDocument } from '@/lib/documentProcessor';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
      // Process the document using Unstructured.io
      const elements = await processDocument(file);
      
      // Convert elements to a format suitable for analysis
      const text = elements
        .map(element => element.text)
        .join('\n');

      // Analyze the processed text
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative"
                aria-hidden="true"
              >
                <FileText className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="View supported file formats">
                          <HelpCircle className="w-6 h-6 text-primary" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Supported formats: PDF, DOCX</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </motion.div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-200">
                  Ready to analyze your document
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Upload a PDF or DOCX file to see the AI magic happen. Our intelligent agent will analyze your content and provide detailed insights.
                </p>
                <div className="pt-4 space-y-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Quick Tips:</p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1" role="list">
                    <li role="listitem">• Maximum file size: 10MB</li>
                    <li role="listitem">• Drag and drop supported</li>
                    <li role="listitem">• Text should be machine-readable</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.main>
  );
};
