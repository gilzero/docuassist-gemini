import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ServerInfo } from './ServerInfo';
import { AnalysisSection } from './AnalysisSection';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisOutputProps {
  response: string;
}

export const AnalysisOutput = ({ response }: AnalysisOutputProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Split response into sections based on headers, including Chinese headers
  const sections = response.split(/(?=# |#\s*[\u4e00-\u9fa5]+)/g).filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Result</h2>
          <ServerInfo />
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
        <AnimatePresence mode="wait">
          {sections.length > 1 ? (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <AnalysisSection key={index} section={section} />
              ))}
            </div>
          ) : (
            <AnalysisSection section={response} />
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
};