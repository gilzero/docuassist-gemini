import React from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const EmptyAnalysis = () => (
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
);

export default EmptyAnalysis;