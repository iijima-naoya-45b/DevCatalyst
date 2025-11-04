'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft,
    Send,
    Brain,
    Sparkles,
    CheckCircle,
    Lightbulb,
    Target,
    FileText
} from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'aria';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    displayedContent?: string;
}

interface ProjectData {
    name: string;
    description: string;
    goals: string;
    status: 'active' | 'completed' | 'on-hold';
}

export default function NewProjectPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [ariaThinking, setAriaThinking] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [projectData, setProjectData] = useState<ProjectData>({
        name: '',
        description: '',
        goals: '',
        status: 'active'
    });
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // ストリーミング中かチェック
    const isStreaming = messages.some(msg => msg.isStreaming);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scroll({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ストリーミングアニメーション
    useEffect(() => {
        const streamingMessage = messages.find(msg => msg.isStreaming);
        if (!streamingMessage) return;

        const fullContent = streamingMessage.content;
        const currentDisplayed = streamingMessage.displayedContent || '';

        if (currentDisplayed.length < fullContent.length) {
            const remainingContent = fullContent.substring(currentDisplayed.length);
            let chunkSize = 1;

            if (remainingContent.startsWith('\n')) {
                chunkSize = 1;
            } else if (currentDisplayed.match(/[。、！？\n]$/)) {
                chunkSize = Math.floor(Math.random() * 3) + 1;
            } else {
                chunkSize = Math.floor(Math.random() * 4) + 3;
            }

            chunkSize = Math.min(chunkSize, remainingContent.length);

            const timer = setTimeout(() => {
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === streamingMessage.id
                            ? {
                                ...msg,
                                displayedContent: fullContent.substring(0, currentDisplayed.length + chunkSize)
                            }
                            : msg
                    )
                );
            }, 80 + Math.random() * 40);

            return () => clearTimeout(timer);
        } else {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === streamingMessage.id
                        ? { ...msg, isStreaming: false, displayedContent: fullContent }
                        : msg
                )
            );
            setAriaThinking(false);
        }
    }, [messages]);

    // 初回メッセージ
    useEffect(() => {
        const timer = setTimeout(() => {
            addAriaMessage(
                "こんにちは！新しいプロジェクトを一緒に作りましょう。✨\n\nまず、プロジェクトの名前を教えてください。どんなプロジェクトですか？\n\n例えば：\n• 「ECサイト立ち上げプロジェクト」\n• 「新商品開発プロジェクト」\n• 「マーケティング戦略立案」"
            );
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const addAriaMessage = (content: string) => {
        const newMessage: Message = {
            id: `aria-${Date.now()}`,
            type: 'aria',
            content,
            timestamp: new Date(),
            isStreaming: true,
            displayedContent: ''
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addUserMessage = (content: string) => {
        const newMessage: Message = {
            id: `user-${Date.now()}`,
            type: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleAriaResponse = (userInput: string, step: number) => {
        setAriaThinking(true);

        setTimeout(() => {
            switch (step) {
                case 0: // プロジェクト名入力後
                    setProjectData(prev => ({ ...prev, name: userInput }));
                    addAriaMessage(
                        `「${userInput}」、素晴らしいですね！🎯\n\nでは、このプロジェクトの目的や概要を教えてください。\n\n何を実現したいプロジェクトですか？どんな課題を解決しますか？\n\nできるだけ具体的に教えていただけると、後で振り返る時に役立ちますよ。`
                    );
                    setCurrentStep(1);
                    break;

                case 1: // 概要入力後
                    setProjectData(prev => ({ ...prev, description: userInput }));
                    addAriaMessage(
                        `なるほど、よく分かりました！💡\n\n最後に、このプロジェクトで達成したい具体的な目標を教えてください。\n\n例えば：\n• 「3ヶ月以内にベータ版をローンチ」\n• 「月間1000件の新規顧客獲得」\n• 「コスト30%削減を実現」\n\nどんな成果を目指していますか？`
                    );
                    setCurrentStep(2);
                    break;

                case 2: // 目標入力後
                    setProjectData(prev => ({ ...prev, goals: userInput }));
                    addAriaMessage(
                        `完璧です！✨\n\nプロジェクトの全体像が見えてきました。では、これまでの情報をまとめますね。\n\n📋 プロジェクト概要：\n━━━━━━━━━━━━━━\n🎯 プロジェクト名: ${projectData.name}\n\n📝 概要: ${projectData.description}\n\n🎪 目標: ${userInput}\n━━━━━━━━━━━━━━\n\nこの内容でプロジェクトを作成してよろしいですか？\n\n下の「プロジェクトを作成」ボタンをクリックしてください！`
                    );
                    setCurrentStep(3);
                    break;
            }
        }, 1000 + Math.random() * 500);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || isStreaming || ariaThinking) return;

        addUserMessage(inputValue);
        handleAriaResponse(inputValue, currentStep);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleCreateProject = () => {
        // TODO: APIにデータを送信
        console.log('プロジェクト作成:', projectData);
        router.push('/dashboard/projects');
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/dashboard/projects')}
                                className="text-slate-700 dark:text-gray-300 hover:text-gold-enhanced dark:hover:text-gold hover:bg-gold/10 -ml-2"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                プロジェクト一覧に戻る
                            </Button>
                            <div className="flex items-center space-x-3">
                                <Brain className="h-8 w-8 text-gold" />
                                <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-gray-200">
                                    Ariaと一緒にプロジェクトを作成
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* チャット履歴 */}
                    <Card className="border border-gold/25 dark:border-blue-900/20 border-amber-300 bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-yellow-50/95 dark:bg-gradient-to-br dark:from-black/90 dark:via-slate-950/90 dark:to-black/90 backdrop-blur-md shadow-2xl">
                        <CardContent className="p-0">
                            <div
                                ref={chatContainerRef}
                                className="h-[500px] overflow-y-auto p-6 space-y-6"
                            >
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex items-start space-x-3 transition-all duration-300 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        {/* アバター */}
                                        <div className="flex-shrink-0">
                                            {message.type === 'aria' ? (
                                                <div className="relative">
                                                    <Avatar className="w-10 h-10 ring-2 ring-gold/40">
                                                        <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest font-semibold">
                                                            <Brain className="w-5 h-5 animate-aria-pulse" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-gold to-bronze rounded-full border-2 border-navy-dark flex items-center justify-center animate-aria-float">
                                                        <Sparkles className="w-2 h-2 text-navy-deepest animate-pulse" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <Avatar className="w-10 h-10 ring-2 ring-blue-400/40">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                                        You
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>

                                        {/* メッセージ内容 */}
                                        <div className={`flex-1 transition-all duration-300 ${message.type === 'user' ? 'max-w-xs ml-auto' : 'max-w-2xl'}`}>
                                            <div className={`rounded-2xl p-4 ${message.type === 'aria'
                                                ? 'bg-gradient-to-br from-amber-100/80 to-yellow-100/80 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 border border-gold/20 dark:border-slate-600/30 border-amber-300'
                                                : 'bg-blue-600 text-white'
                                                } ${message.isStreaming ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}`}>
                                                <p className={`whitespace-pre-wrap leading-relaxed ${message.type === 'aria' ? 'text-gray-800 dark:text-gray-100' : ''}`}>
                                                    {message.type === 'aria' ? (message.displayedContent || message.content) : message.content}
                                                </p>
                                            </div>

                                            {/* タイムスタンプ */}
                                            <div className={`mt-2 text-xs text-slate-500 dark:text-gray-400 transition-all duration-200 ${message.type === 'user' ? 'text-right' : ''}`}>
                                                {message.timestamp.toLocaleTimeString('ja-JP', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* アリア思考中インジケーター */}
                                {ariaThinking && !isStreaming && (
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10 ring-2 ring-gold/40 aria-thinking">
                                            <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest">
                                                <Brain className="w-5 h-5 animate-aria-pulse" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 border border-gold/20 dark:border-slate-600/30 border-amber-300 rounded-2xl p-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gold dark:bg-gold-light rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gold dark:bg-gold-light rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gold dark:bg-gold-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-sm text-gold dark:text-gold-light">アリアが考えています...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 入力エリア */}
                    <Card className="border border-gold/25 dark:border-blue-900/20 border-amber-300 bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-yellow-50/95 dark:bg-gradient-to-br dark:from-black/90 dark:via-slate-950/90 dark:to-black/90 backdrop-blur-md shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={
                                            currentStep === 0 ? "プロジェクト名を入力..." :
                                            currentStep === 1 ? "プロジェクトの概要を入力..." :
                                            currentStep === 2 ? "達成したい目標を入力..." :
                                            "Ariaとチャット..."
                                        }
                                        disabled={ariaThinking || isStreaming || currentStep === 3}
                                        className="pr-12 h-12 bg-amber-50/90 dark:bg-slate-900/90 border-gold/20 dark:border-slate-600/30 border-amber-300 focus:border-gold dark:focus:border-slate-500 focus:border-amber-500 text-gray-900 dark:text-gray-100 placeholder-amber-600 dark:placeholder-gray-500"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || ariaThinking || isStreaming || currentStep === 3}
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light hover:shadow-lg hover:shadow-gold/30 hover:scale-110 transition-all duration-300 ease-out disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* プロジェクト作成ボタン */}
                                {currentStep === 3 && (
                                    <Button
                                        onClick={handleCreateProject}
                                        className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 whitespace-nowrap"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        プロジェクトを作成
                                    </Button>
                                )}
                            </div>

                            {/* プログレスインジケーター */}
                            <div className="mt-4 flex items-center justify-center space-x-2">
                                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep >= 0 ? 'bg-gold dark:bg-gold-light' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-gold dark:bg-gold-light' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gold dark:bg-gold-light' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-green-500 dark:bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ヒントカード */}
                    <Card className="glass-effect border-gold/20 bg-white/80 dark:bg-navy-card/80">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif text-amber-700 dark:text-gold-light flex items-center space-x-2">
                                <Lightbulb className="h-5 w-5" />
                                <span>ヒント</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-slate-600 dark:text-gray-200">
                                <p>💡 Ariaとの対話を通じて、プロジェクトの要点を整理していきます</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>プロジェクト名：どんなプロジェクトかを表す名前</li>
                                    <li>概要：プロジェクトの目的や解決したい課題</li>
                                    <li>目標：達成したい具体的な成果</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </div>
    );
}

