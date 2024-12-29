import React from 'react';
import { Copy, Server } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Result</h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <Server className="h-3 w-3" />
            <span>Processed in Singapore</span>
          </div>
        </div>
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
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
              li: ({ children }) => <li className="mb-2">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </motion.div>
  );
};