import React from 'react';
import { Server } from 'lucide-react';

export const ServerInfo = () => (
  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
    <Server className="h-3 w-3" />
    <span>Processed in Singapore</span>
  </div>
);