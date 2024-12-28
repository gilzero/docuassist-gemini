import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
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

      console.log('Extracted text:', text); // For debugging
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
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">AI Document Editor Assistant</h1>
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please configure your Gemini API key in the environment variables (VITE_GEMINI_API_KEY)
          </AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="h-[calc(100vh-12rem)]">
          {response ? (
            <ResponseDisplay response={response} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Upload a document to see the analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;