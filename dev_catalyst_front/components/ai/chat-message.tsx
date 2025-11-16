import React from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '@/lib/types/ai';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <User className="h-6 w-6 text-blue-500" />
          ) : (
            <Bot className="h-6 w-6 text-green-500" />
          )}
        </div>
        <div className={`p-3 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
