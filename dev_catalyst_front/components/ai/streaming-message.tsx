import React from 'react';
import { Bot } from 'lucide-react';

interface StreamingMessageProps {
  content: string;
}

export function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-2 max-w-[80%]">
        <div className="flex-shrink-0">
          <Bot className="h-6 w-6 text-green-500" />
        </div>
        <div className="p-3 rounded-lg bg-white border">
          <p className="text-sm whitespace-pre-wrap">
            {content}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    </div>
  );
}
