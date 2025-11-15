'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Brain,
  MessageCircle,
  Sparkles,
  Send,
  Loader2,
  Repeat,
  Lightbulb,
  Rocket,
} from 'lucide-react';
import {
  RailsApiService,
  aiService,
  type AiChatMessage,
  type ChatRequest,
  type IdeaConfidenceLevel,
} from '@/lib/services';
import { withAuthToken } from '@/lib/hooks/use-auth-token';

type MessageRole = 'assistant' | 'user';

interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  suggestions?: string[];
  isStreaming?: boolean;
}

const IDEA_PRESETS: Record<IdeaConfidenceLevel, { title: string; description: string; prompt: string }> = {
  high: {
    title: '確度が高いアイデア',
    description: '既に課題・解決策・ターゲットがおおまかに定まっている状態で、実行フェーズの壁を整理したい。',
    prompt:
      'こんにちは。アイデアの成熟度が高いと判断しました。最初に、現状整理として「想定ターゲット」と「提供価値」を教えてください。実施に向けて壁になっている論点もあれば併せて共有してください。',
  },
  low: {
    title: '確度がまだ低いアイデア',
    description: '課題や価値仮説を探りながら、どの方向に進めるかを考えたい段階。',
    prompt:
      'こんにちは。まだ探索段階のアイデアですね。まず、着想のきっかけになった課題や気づきを教えてください。誰のどんな状況を見て、このアイデアを思いつきましたか？',
  },
};

const DEFAULT_SUGGESTIONS = [
  '顧客のタイプについて掘り下げましょうか？',
  '提供価値の伝え方を整えますか？',
  'マーケティングアイデアを一緒に考えますか？',
];

const SUGGESTION_OPTIONS: Record<IdeaConfidenceLevel, string[]> = {
  high: [
    'ターゲット顧客の具体像を一緒に整理したいです',
    '提供価値の差別化ポイントを掘り下げたいです',
    '実行プランと優先順位を提案してほしいです',
  ],
  low: [
    'アイデアのきっかけと課題意識を整理したいです',
    '想定ユーザーの悩みや状況を言語化したいです',
    '市場リサーチの初めの一歩を教えてください',
  ],
};

function createMessage(
  role: MessageRole,
  content: string,
  suggestions?: string[],
  overrides?: Partial<ConversationMessage>
): ConversationMessage {
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    role,
    content,
    isStreaming: overrides?.isStreaming ?? false,
    suggestions,
    timestamp: overrides?.timestamp ?? Date.now(),
  };
}

export default function NewProjectPage() {
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [ideaConfidence, setIdeaConfidence] = useState<IdeaConfidenceLevel | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const activePreset = ideaConfidence ? IDEA_PRESETS[ideaConfidence] : null;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSelectConfidence = useCallback((confidence: IdeaConfidenceLevel) => {
    setIdeaConfidence(confidence);
    setMessages([
      createMessage('assistant', IDEA_PRESETS[confidence].prompt, SUGGESTION_OPTIONS[confidence]),
    ]);
    setError(null);
    setInputValue('');
    setSessionId(null);
  }, []);

  const conversationPayload = useMemo<AiChatMessage[]>(() => {
    return messages.map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!ideaConfidence) return;
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMessage = createMessage('user', trimmed);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setError(null);
      setIsLoading(true);

      try {
        const payload: AiChatMessage[] = [
          ...conversationPayload,
          {
            role: 'user',
            content: trimmed,
          },
        ];

        const streamingMessage = createMessage('assistant', '', undefined, { isStreaming: true });
        const streamingMessageId = streamingMessage.id;
        setMessages((prev) => [...prev, streamingMessage]);

        let collectedContent = '';

        const streamPayload: ChatRequest = {
          messages: payload.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          provider: 'openai',
          stream: true,
          session_id: sessionId ?? undefined,
        };

        await withAuthToken(() =>
          aiService.chatCompletionStream(
            streamPayload,
            (chunk) => {
              collectedContent += chunk;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                      ...message,
                      content: message.content + chunk,
                      timestamp: Date.now(),
                    }
                    : message,
                ),
              );
            },
            async (streamError) => {
              setError(streamError || 'ストリーミング中にエラーが発生しました。');
              // フォールバックとして通常のAPI呼び出しを試行
              try {
                const fallbackResponse = await RailsApiService.sendAiChatMessage({
                  idea_confidence: ideaConfidence,
                  messages: payload,
                  session_id: sessionId ?? undefined,
                });
                const { data } = fallbackResponse;
                if (data?.assistant_message) {
                  collectedContent = data.assistant_message;
                  setMessages((prev) =>
                    prev.map((message) =>
                      message.id === streamingMessageId
                        ? {
                          ...message,
                          content: data.assistant_message,
                          suggestions:
                            ideaConfidence
                              ? SUGGESTION_OPTIONS[ideaConfidence]
                              : DEFAULT_SUGGESTIONS,
                          isStreaming: false,
                        }
                        : message,
                    ),
                  );
                  if (typeof data.session_id === 'number') {
                    setSessionId(data.session_id);
                  }
                  setError(null);
                  return;
                }
              } catch (fallbackError) {
                console.error(fallbackError);
                setMessages((prev) => prev.filter((message) => message.id !== streamingMessageId));
              }
            },
            () => {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                      ...message,
                      content: collectedContent || message.content,
                      isStreaming: false,
                      suggestions:
                        ideaConfidence
                          ? SUGGESTION_OPTIONS[ideaConfidence]
                          : DEFAULT_SUGGESTIONS,
                    }
                    : message,
                ),
              );
            },
          ),
        );

        if (!collectedContent) {
          setError('Aria からの応答を受信できませんでした。もう一度お試しください。');
        }
      } catch (err: unknown) {
        setError('会話の送信中にエラーが発生しました。時間をおいて再度お試しください。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationPayload, ideaConfidence, sessionId],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (isLoading) return;
      setInputValue('');
      void sendMessage(suggestion);
    },
    [isLoading, sendMessage],
  );

  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME入力中（変換確定前）の場合は送信しない
    if (isComposing) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(inputValue);
    }
  };

  const resetSession = () => {
    setIdeaConfidence(null);
    setMessages([]);
    setInputValue('');
    setError(null);
    setIsLoading(false);
    setSessionId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/projects')}
            className="text-slate-700 dark:text-gray-300 hover:gold-soft-text-enhanced dark:hover:gold-soft-text hover:bg-gold/10 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            プロジェクト一覧に戻る
          </Button>
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 gold-soft-text" />
            <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-gray-200">
              Aria とプロジェクトを構想する
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            いま抱えているアイデアの成熟度に近い方を選んでください。Aria が最適な問いを通して、次の一歩を一緒に整えます。
          </p>
        </div>
        {ideaConfidence && (
          <Button variant="outline" onClick={resetSession} className="flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            アイデアを選び直す
          </Button>
        )}
      </div>

      {!ideaConfidence && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(IDEA_PRESETS) as IdeaConfidenceLevel[]).map((confidence) => {
            const preset = IDEA_PRESETS[confidence];
            return (
              <Card
                key={confidence}
                className="relative overflow-hidden border border-gold/20 hover:border-gold/60 transition-all duration-300 cursor-pointer"
                onClick={() => handleSelectConfidence(confidence)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {confidence === 'high' ? <Rocket className="w-5 h-5 text-gold" /> : <Lightbulb className="w-5 h-5 text-gold" />}
                    {preset.title}
                  </CardTitle>
                  <CardDescription>{preset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl bg-gold/10 border border-gold/20 p-4 text-sm text-slate-700 dark:text-gray-200 space-y-2">
                    <p className="font-medium gold-soft-text">Aria からの最初の問いかけ（プレビュー）</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{preset.prompt}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {ideaConfidence && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card className="border border-gold/30 dark:border-blue-900/30 backdrop-blur-md shadow-2xl">
              <CardContent className="p-0">
                <div ref={chatContainerRef} className="h-[520px] overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 transition-all duration-300 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        {message.role === 'assistant' ? (
                          <Avatar className="w-10 h-10 ring-2 ring-gold/40">
                            <AvatarImage src="/aria-celestia.png" alt="Aria" />
                            <AvatarFallback className="gold-soft-gradient text-aria-dark-soft font-semibold">
                              <Brain className="w-5 h-5 animate-aria-pulse" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="w-10 h-10 ring-2 ring-blue-400/40">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'max-w-xs ml-auto' : 'max-w-2xl'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${message.role === 'assistant'
                            ? 'bg-gradient-to-br from-gold/15 via-gold/10 to-transparent border border-gold/30 text-slate-900 dark:text-gray-100'
                            : 'bg-blue-600 text-white'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.isStreaming && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Aria が考えています…</span>
                            </div>
                          )}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.slice(0, 3).map((suggestion) => (
                                <Button
                                  key={suggestion}
                                  variant="outline"
                                  size="sm"
                                  className="border-gold/40 text-sm text-slate-700 dark:text-gray-200 hover:bg-gold/10 dark:hover:bg-gold/20"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  disabled={isLoading}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          className={`mt-2 text-xs text-muted-foreground ${message.role === 'user' ? 'text-right' : ''}`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gold/25 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md">
              <CardContent className="p-4 space-y-3">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      disabled={isLoading}
                      placeholder="続きの質問やメモを書いてください…"
                      rows={1}
                      className="flex-1 min-h-[3rem] max-h-32 resize-none pr-12"
                    />
                    <Button
                      onClick={() => void sendMessage(inputValue)}
                      disabled={isLoading || inputValue.trim().length === 0}
                      size="sm"
                      className="absolute right-2 bottom-2 aria-gold-surface text-aria-dark-soft hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Enter で送信、Shift + Enter で改行。いつでも「アイデアを選び直す」から別パターンの対話を始められます。
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {activePreset && (
              <Card className="border border-gold/20 bg-gradient-to-br from-gold/10 via-transparent to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 gold-soft-text" />
                    Aria の観点
                  </CardTitle>
                  <CardDescription>
                    {activePreset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700 dark:text-gray-200">
                  <p className="font-medium gold-soft-text">対話の進め方</p>
                  <p className="leading-relaxed">{activePreset.prompt}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  対話の活用ヒント
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <p>• 迷っている論点は正直に打ち明けると、Aria が深掘りしてくれます。</p>
                <p>• 途中で観点を変えたくなったら、思いついたキーワードを伝えて問い直しましょう。</p>
                <p>• プロジェクト化が決まったら、ダッシュボードの「プロジェクト作成」から正式に登録できます。</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
