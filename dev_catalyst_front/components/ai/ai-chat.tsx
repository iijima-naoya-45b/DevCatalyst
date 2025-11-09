'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useAIApi } from '@/lib/hooks/use-ai-api';
import { ChatMessage } from '@/lib/services/ai-service';

interface Message extends ChatMessage {
    id: string;
    timestamp: Date;
}

export function AIChat() {
    const {
        isLoading,
        error,
        isAuthenticated,
        chatCompletion,
        chatCompletionStream,
        getAvailableModels,
        clearError
    } = useAIApi();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
    const [model, setModel] = useState<string>('');
    const [availableModels, setAvailableModels] = useState<any>(null);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 利用可能なモデルを取得
    useEffect(() => {
        if (isAuthenticated) {
            getAvailableModels().then((models) => {
                if (models) {
                    setAvailableModels(models);
                    // デフォルトモデルを設定
                    if (models.models.openai.length > 0) {
                        setModel(models.models.openai[0].id);
                    }
                }
            });
        }
    }, [isAuthenticated, getAvailableModels]);

    // メッセージリストの最下部にスクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage]);

    // エラーをクリア
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isStreaming) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsStreaming(true);
        setStreamingMessage('');

        const chatMessages: ChatMessage[] = [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
        ];

        try {
            await chatCompletionStream(
                {
                    messages: chatMessages,
                    provider,
                    model: model || undefined,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true,
                },
                (chunk) => {
                    setStreamingMessage(prev => prev + chunk);
                },
                (error) => {
                    console.error('Streaming error:', error);
                    setIsStreaming(false);
                },
                () => {
                    // ストリーミング完了
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: streamingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    setStreamingMessage('');
                    setIsStreaming(false);
                }
            );
        } catch (error) {
            setIsStreaming(false);
            setStreamingMessage('');
        }
    };

    const handleProviderChange = (newProvider: 'openai' | 'anthropic') => {
        setProvider(newProvider);
        if (availableModels) {
            const models = availableModels.models[newProvider];
            if (models.length > 0) {
                setModel(models[0].id);
            }
        }
    };

    if (isAuthenticated === false) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">認証が必要です</h3>
                        <p className="text-gray-600 mb-4">AI機能を使用するにはログインしてください。</p>
                        <Button onClick={() => window.location.href = '/login'}>
                            ログインページへ
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Chat Assistant
                </CardTitle>

                {/* モデル選択 */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Provider</label>
                        <select
                            value={provider}
                            onChange={(event) => handleProviderChange(event.target.value as 'openai' | 'anthropic')}
                            className="w-full rounded-lg border border-gold/35 bg-white px-3 py-2 text-sm text-aria-dark-soft shadow-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:bg-slate-900 dark:text-gray-100"
                        >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Model</label>
                        <select
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            className="w-full rounded-lg border border-gold/35 bg-white px-3 py-2 text-sm text-aria-dark-soft shadow-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:bg-slate-900 dark:text-gray-100"
                        >
                            <option value="" disabled>
                                モデルを選択してください
                            </option>
                            {availableModels?.models[provider]?.map((modelOption: any) => (
                                <option key={modelOption.id} value={modelOption.id}>
                                    {modelOption.name}（{modelOption.plan_required}）
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* エラー表示 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {/* メッセージリスト */}
                <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 border rounded-md bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {message.role === 'user' ? (
                                        <User className="h-6 w-6 text-blue-500" />
                                    ) : (
                                        <Bot className="h-6 w-6 text-green-500" />
                                    )}
                                </div>
                                <div
                                    className={`p-3 rounded-lg ${message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white border'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {message.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ストリーミングメッセージ */}
                    {isStreaming && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex gap-2 max-w-[80%]">
                                <div className="flex-shrink-0">
                                    <Bot className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="p-3 rounded-lg bg-white border">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {streamingMessage}
                                        <span className="animate-pulse">|</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* 入力フォーム */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力してください..."
                        disabled={isLoading || isStreaming}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading || isStreaming}
                        size="icon"
                    >
                        {isLoading || isStreaming ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>

                {/* ユーザープラン表示 */}
                {availableModels && (
                    <div className="mt-4 text-center">
                        <Badge variant="outline">
                            Current Plan: {availableModels.user_plan}
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}