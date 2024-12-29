import React from 'react';
import { Copy, Server, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

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

  // Split response into sections based on headers
  const sections = response.split(/(?=# )/g).filter(Boolean);

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
        <AnimatePresence mode="wait">
          {sections.length > 1 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {sections.map((section, index) => (
                <AccordionItem 
                  key={index} 
                  value={`section-${index}`}
                  className="border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      {section.split('\n')[0].replace('# ', '')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className={cn(
                      "prose prose-gray dark:prose-invert max-w-none",
                      "prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
                      "prose-p:text-gray-700 dark:prose-p:text-gray-300",
                      "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
                      "prose-ul:list-disc prose-ul:pl-6",
                      "prose-ol:list-decimal prose-ol:pl-6",
                      "prose-blockquote:border-l-4 prose-blockquote:border-gray-200 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic",
                      // Add specific styles for Chinese text
                      "text-base leading-relaxed tracking-wide",
                      "[&>*]:mb-4 last:[&>*]:mb-0",
                      "[&_strong]:font-medium [&_strong]:text-gray-900 dark:text-gray-100",
                      "[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg",
                      "[&_h1]:mb-6 [&_h2]:mb-4 [&_h3]:mb-3",
                      "[&_ul]:space-y-2 [&_ol]:space-y-2",
                      "[&_li]:pl-2",
                      // Indent nested content
                      "[&_ul_ul]:ml-4 [&_ol_ol]:ml-4",
                      // Style for Chinese punctuation
                      "[&_*]:break-words [&_*]:overflow-wrap-anywhere",
                      // Better spacing for Chinese characters
                      "[&_p]:leading-8"
                    )}>
                      <ReactMarkdown>
                        {section.split('\n').slice(1).join('\n')}
                      </ReactMarkdown>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className={cn(
              "prose prose-gray dark:prose-invert max-w-none",
              "prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
              "prose-p:text-gray-700 dark:prose-p:text-gray-300",
              "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
              "prose-ul:list-disc prose-ul:pl-6",
              "prose-ol:list-decimal prose-ol:pl-6",
              "prose-blockquote:border-l-4 prose-blockquote:border-gray-200 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic",
              // Add specific styles for Chinese text
              "text-base leading-relaxed tracking-wide",
              "[&>*]:mb-4 last:[&>*]:mb-0",
              "[&_strong]:font-medium [&_strong]:text-gray-900 dark:text-gray-100",
              "[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg",
              "[&_h1]:mb-6 [&_h2]:mb-4 [&_h3]:mb-3",
              "[&_ul]:space-y-2 [&_ol]:space-y-2",
              "[&_li]:pl-2",
              // Indent nested content
              "[&_ul_ul]:ml-4 [&_ol_ol]:ml-4",
              // Style for Chinese punctuation
              "[&_*]:break-words [&_*]:overflow-wrap-anywhere",
              // Better spacing for Chinese characters
              "[&_p]:leading-8"
            )}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
};