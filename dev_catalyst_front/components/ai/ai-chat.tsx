'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { useAIApi } from '@/lib/hooks/use-ai-api';
import type { Message, AIProvider, ChatMessage } from '@/lib/types/ai';
import { ChatMessage as ChatMessageComponent } from './chat-message';
import { StreamingMessage } from './streaming-message';
import { ModelSelector } from './model-selector';
import { ChatInput } from './chat-input';
import { ErrorAlert } from './error-alert';
import { AuthRequired } from './auth-required';

export function AIChat() {
  const {
    isLoading,
    error,
    isAuthenticated,
    chatCompletionStream,
    getAvailableModels,
    clearError,
  } = useAIApi();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<any>(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getAvailableModels().then((models) => {
        if (models) {
          setAvailableModels(models);
          if (models.models.openai.length > 0) {
            setModel(models.models.openai[0].id);
          }
        }
      });
    }
  }, [isAuthenticated, getAvailableModels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingMessage('');

    const chatMessages: ChatMessage[] = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.content },
    ];

    await chatCompletionStream(
      {
        messages: chatMessages,
        provider,
        model: model || undefined,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      },
      (chunk) => setStreamingMessage((prev) => prev + chunk),
      (error) => {
        console.error('Streaming error:', error);
        setIsStreaming(false);
      },
      () => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: streamingMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessage('');
        setIsStreaming(false);
      }
    );
  };

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    if (availableModels) {
      const models = availableModels.models[newProvider];
      if (models.length > 0) {
        setModel(models[0].id);
      }
    }
  };

  if (isAuthenticated === false) {
    return <AuthRequired />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Chat Assistant
        </CardTitle>

        <ModelSelector
          provider={provider}
          model={model}
          availableModels={availableModels}
          onProviderChange={handleProviderChange}
          onModelChange={setModel}
        />
      </CardHeader>

      <CardContent className="p-6">
        {error && <ErrorAlert message={error} />}

        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 border rounded-md bg-gray-50">
          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}

          {isStreaming && <StreamingMessage content={streamingMessage} />}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading || isStreaming}
          isLoading={isLoading || isStreaming}
        />

        {availableModels && (
          <div className="mt-4 text-center">
            <Badge variant="outline">Current Plan: {availableModels.user_plan}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
