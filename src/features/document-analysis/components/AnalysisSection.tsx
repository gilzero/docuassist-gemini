import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalysisSectionProps {
  section: string;
}

export const AnalysisSection = ({ section }: AnalysisSectionProps) => {
  const headerMatch = section.match(/^#\s*([^\n]+)/);
  const header = headerMatch ? headerMatch[1].trim() : '';
  const content = headerMatch ? section.slice(headerMatch[0].length).trim() : section;
  
  const markdownStyles = cn(
    "prose prose-gray dark:prose-invert max-w-none",
    "prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
    "prose-p:text-gray-700 dark:prose-p:text-gray-300",
    "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
    "prose-ul:list-disc prose-ul:pl-6",
    "prose-ol:list-decimal prose-ol:pl-6",
    "prose-blockquote:border-l-4 prose-blockquote:border-gray-200 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic",
    "text-base leading-relaxed tracking-normal",
    "[&>*]:mb-4 last:[&>*]:mb-0",
    "[&_strong]:font-medium [&_strong]:text-gray-900 dark:text-gray-100",
    "[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg",
    "[&_h1]:mb-6 [&_h2]:mb-4 [&_h3]:mb-3",
    "[&_ul]:space-y-2 [&_ol]:space-y-2",
    "[&_li]:pl-2",
    "[&_ul_ul]:ml-4 [&_ol_ol]:ml-4",
    "[&_*]:break-words",
    "[&_p]:leading-8",
    "[&_p]:whitespace-normal",
    "[&_p]:break-words",
    "tracking-normal leading-normal",
    "[&_p]:text-justify"
  );

  if (!header) {
    return (
      <div className={markdownStyles}>
        <ReactMarkdown>{section}</ReactMarkdown>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem 
        value={`section-${header}`}
        className="border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-2 text-lg font-medium">
            {header.replace(/：$/, '')}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className={markdownStyles}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};