import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface ResponseDisplayProps {
  response: string;
}

export const ResponseDisplay = ({ response }: ResponseDisplayProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Result</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <ScrollArea className="flex-1 p-6">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
};