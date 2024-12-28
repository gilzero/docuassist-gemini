import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { analyzeDocument } from '@/lib/gemini';
import { toast } from 'sonner';

const Index = () => {
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const analysis = await analyzeDocument(text, file.name);
      setResponse(analysis);
      toast.success('Document analysis complete');
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">AI Document Editor Assistant</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
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