import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

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
    <Card className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Analysis Result</h2>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="whitespace-pre-wrap">{response}</div>
      </ScrollArea>
    </Card>
  );
};