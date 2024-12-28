import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Sparkles, Brain } from 'lucide-react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Index = () => {
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
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

      console.log('Extracted text:', text);
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Dreamer AI
              </h1>
            </div>
            <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
              Editor AI Agent <Sparkles className="w-5 h-5 text-yellow-500" />
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your documents with advanced AI analysis. Upload your file and let our intelligent agent enhance your content.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
                <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </div>
              
              {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg h-[calc(100vh-16rem)] min-h-[500px]">
              {response ? (
                <ResponseDisplay response={response} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="max-w-md space-y-4">
                    <Sparkles className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                      Ready to analyze your document
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload a PDF or DOCX file to see the AI magic happen
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;