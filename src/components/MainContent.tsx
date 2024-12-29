import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ResponseDisplay } from './ResponseDisplay';
import { UploadProgress } from './UploadProgress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const MainContent = () => {
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
      } else if (fileType === 'doc') {
        throw new Error('Legacy .doc files are not supported. Please convert to .docx');
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      <div className="space-y-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
        >
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        </motion.div>
        
        {uploadProgress > 0 && !isProcessing && (
          <UploadProgress progress={uploadProgress} />
        )}
        
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg h-[calc(100vh-16rem)] min-h-[500px]"
      >
        {response ? (
          <ResponseDisplay response={response} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md space-y-4"
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
              >
                <AlertTriangle className="w-12 h-12 text-primary/50 mx-auto mb-4" />
              </motion.div>
              <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                Ready to analyze your document
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a PDF or DOCX file to see the AI magic happen
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};