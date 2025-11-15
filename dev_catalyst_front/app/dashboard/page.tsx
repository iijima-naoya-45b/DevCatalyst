'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  MessageCircle,
  Plus,
  Loader2,
  RefreshCw,
  ChevronRight,
  Search,
  Send,
  List,
  Bot,
  Sparkles,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  RailsApiService,
  type ChatSessionSummary,
  type ChatSessionMessagesPayload,
  aiService,
} from '@/lib/services';
import { withAuthToken } from '@/lib/hooks/use-auth-token';
import type { ChatRequest } from '@/lib/types/ai';

type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
};

const SESSIONS_PER_PAGE = 10;
const DEFAULT_QUICK_REPLIES = [
  'もう少し詳しく教えてください',
  '次にやるべきことは何ですか？',
  '他の選択肢も検討したいです',
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsRefreshing, setSessionsRefreshing] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [activeSessionMeta, setActiveSessionMeta] = useState<ChatSessionSummary | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [messageInput, setMessageInput] = useState('');
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const filteredSessions = useMemo(() => {
    if (!searchTerm.trim()) {
      return sessions;
    }

    const keyword = searchTerm.trim().toLowerCase();
    return sessions.filter((session) => {
      const titleMatch = session.title?.toLowerCase().includes(keyword);
      const previewMatch = session.last_message_preview?.toLowerCase().includes(keyword);
      return titleMatch || previewMatch;
    });
  }, [sessions, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / SESSIONS_PER_PAGE));
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * SESSIONS_PER_PAGE;
    return filteredSessions.slice(start, start + SESSIONS_PER_PAGE);
  }, [filteredSessions, currentPage]);

  const loadSessions = useCallback(async () => {
    setSessionsRefreshing(true);
    setSessionsError(null);

    try {
      const response = await withAuthToken(() => RailsApiService.getChatSessions(100));
      const data = Array.isArray(response.data) ? response.data : [];
      setSessions(data);

      if (data.length === 0) {
        setActiveSessionId(null);
        setActiveSessionMeta(null);
        setMessages([]);
      } else if (activeSessionId === null) {
        const firstSession = data[0];
        setActiveSessionId(firstSession.id);
        setActiveSessionMeta(firstSession);
      } else {
        const existing = data.find((session) => session.id === activeSessionId);
        if (existing) {
          setActiveSessionMeta(existing);
        } else {
          const fallback = data[0];
          setActiveSessionId(fallback.id);
          setActiveSessionMeta(fallback);
        }
      }
    } catch (error) {
      console.error(error);
      setSessionsError('セッション一覧の取得に失敗しました。時間をおいて再試行してください。');
    } finally {
      setSessionsLoading(false);
      setSessionsRefreshing(false);
    }
  }, [activeSessionId]);

  const loadSessionMessages = useCallback(
    async (sessionId: number) => {
      setMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await withAuthToken(() =>
          RailsApiService.getChatSessionMessages(sessionId, { per_page: 200 }),
        );

        const payload = response.data as ChatSessionMessagesPayload | undefined;
        if (!payload) {
          setMessages([]);
          return;
        }

        const normalizedMessages: ConversationMessage[] = payload.messages.map((message) => ({
          id: String(message.id),
          role: message.sender_role === 'aria' ? 'assistant' : 'user',
          content: message.content,
          createdAt: new Date(message.created_at),
        }));

        setMessages(normalizedMessages);

        const metaMatch = sessions.find((session) => session.id === sessionId);
        if (metaMatch) {
          setActiveSessionMeta(metaMatch);
        }
      } catch (error) {
        console.error(error);
        setMessagesError('チャット履歴の読み込みに失敗しました。もう一度お試しください。');
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    [sessions],
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    void loadSessions();
  }, [isAuthenticated, loadSessions, router]);

  useEffect(() => {
    if (activeSessionId !== null) {
      void loadSessionMessages(activeSessionId);
    }
  }, [activeSessionId, loadSessionMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSelectSession = useCallback(
    (session: ChatSessionSummary) => {
      setActiveSessionId(session.id);
      setActiveSessionMeta(session);
      setMessages([]);
      setMessagesError(null);
      void loadSessionMessages(session.id);
    },
    [loadSessionMessages],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSendMessage = useCallback(
    async (presetText?: string) => {
      if (!activeSessionId) {
        return;
      }

      const trimmed = (presetText ?? messageInput).trim();
      if (!trimmed) {
        return;
      }

      if (assistantThinking) {
        return;
      }

      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: new Date(),
      };

      const streamingMessageId = `assistant-${Date.now()}`;
      const streamingMessage: ConversationMessage = {
        id: streamingMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true,
      };

      const conversationBeforeStream = [...messages, userMessage];
      setMessages([...conversationBeforeStream, streamingMessage]);
      setMessageInput('');
      setAssistantThinking(true);
      setMessagesError(null);

      let collectedContent = '';

      const requestPayload: ChatRequest = {
        messages: conversationBeforeStream.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content,
        })),
        provider: 'openai',
        stream: true,
        session_id: activeSessionId,
      };

      try {
        await withAuthToken(() =>
          aiService.chatCompletionStream(
            requestPayload,
            (chunk) => {
              collectedContent += chunk;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                      ...message,
                      content: message.content + chunk,
                    }
                    : message,
                ),
              );
            },
            (errorMessage) => {
              setAssistantThinking(false);
              setMessagesError(errorMessage || 'ストリーミング中にエラーが発生しました。');
              setMessages((prev) => prev.filter((message) => message.id !== streamingMessageId));
            },
            () => {
              setAssistantThinking(false);
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                      ...message,
                      content: collectedContent,
                      isStreaming: false,
                    }
                    : message,
                ),
              );

              void loadSessions();
            },
          ),
        );
      } catch (error) {
        console.error(error);
        setAssistantThinking(false);
        setMessages((prev) => prev.filter((message) => message.id !== streamingMessageId));
        setMessagesError('会話の送信中にエラーが発生しました。時間をおいて再試行してください。');
      }
    },
    [activeSessionId, assistantThinking, loadSessions, messageInput, messages],
  );

  if (sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin gold-soft-text" />
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] w-[80%] mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
            チャットセッション
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            アリアとの対話をセッションごとに整理し、次のアクションを素早く見つけましょう。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => loadSessions()}
            disabled={sessionsRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${sessionsRefreshing ? 'animate-spin' : ''}`} />
            再読み込み
          </Button>
          <Button
            onClick={() => router.push('/dashboard/projects/new')}
            className="aria-gold-surface font-medium shadow-md transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            新しい対話を始める
          </Button>
        </div>
      </div>

      {sessionsError && (
        <Alert variant="destructive">
          <AlertDescription>{sessionsError}</AlertDescription>
        </Alert>
      )}

      {/* スマホ: ドロワーオープンボタン */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2"
        >
          <Menu className="h-4 w-4" />
          セッション一覧
        </Button>
      </div>

      {/* スマホ: ドロワーオーバーレイ */}
      {isDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* スマホ: ドロワー */}
      <div
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gold/25">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">セッション一覧</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 border-b border-gold/25">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="キーワードで検索..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {filteredSessions.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>該当するセッションが見つかりませんでした。</p>
                <p>別のキーワードでお試しください。</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => {
                        handleSelectSession(session);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${isActive
                        ? 'border-gold/60 bg-gold/10 shadow-lg shadow-gold/10'
                        : 'border-gold/15 hover:border-gold/40 hover:bg-gold/10/70'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {session.title}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {new Date(session.last_interacted_at).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {session.last_message_preview && (
                        <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                          {session.last_message_preview}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {session.messages_count} 件
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.last_interacted_at).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {session.archived && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            アーカイブ
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* デスクトップ: セッション一覧サイドバー */}
        <Card
          className="hidden lg:block lg:w-80 xl:w-96 border border-gold/25 dark:border-gold/25 bg-white/90 dark:bg-slate-900/70 backdrop-blur"
        >
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                セッション一覧
              </CardTitle>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {filteredSessions.length} 件
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="キーワードで検索..."
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>該当するセッションが見つかりませんでした。</p>
                <p>別のキーワードでお試しください。</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                {paginatedSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => handleSelectSession(session)}
                      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${isActive
                        ? 'border-gold/60 bg-gold/10 shadow-lg shadow-gold/10'
                        : 'border-gold/15 hover:border-gold/40 hover:bg-gold/10/70'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {session.title}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {new Date(session.last_interacted_at).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {session.last_message_preview && (
                        <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                          {session.last_message_preview}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {session.messages_count} 件
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.last_interacted_at).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {session.archived && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            アーカイブ
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  前へ
                </Button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  次へ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="flex-1 border border-gold/25 dark:border-gold/25 bg-white/90 dark:bg-slate-900/70 backdrop-blur"
        >
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeSessionMeta?.title ?? 'セッションを選択してください'}
                </CardTitle>
                {activeSessionMeta && (
                  <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                    最終更新:{' '}
                    {new Date(activeSessionMeta.last_interacted_at).toLocaleString('ja-JP')}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MessageCircle className="h-4 w-4" />
                {messages.length} 件
              </div>
            </div>
            {messagesError && (
              <Alert variant="destructive">
                <AlertDescription>{messagesError}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="flex flex-col h-[32rem] lg:h-[36rem]">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-4"
            >
              {messagesLoading ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  履歴を読み込んでいます...
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-500 dark:text-gray-300">
                  <Bot className="h-10 w-10 text-gold/70" />
                  <p className="text-sm">セッションを選択すると、これまでの対話が表示されます。</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div
                      className={`max-w-full rounded-2xl px-4 py-3 shadow ${message.role === 'user'
                        ? 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-100 text-slate-900'
                        : 'bg-slate-900/80 text-amber-100 border border-gold/30'
                        } ${message.isStreaming ? 'animate-pulse' : ''}`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {message.createdAt.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}

              {assistantThinking && (
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/15 border border-gold/30">
                    <Sparkles className="h-4 w-4 text-gold animate-pulse" />
                  </div>
                  <span>アリアが考えています...</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={(event) => {
                      // IME入力中（変換確定前）の場合は送信しない
                      if (isComposing) return;

                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    disabled={!activeSessionId || assistantThinking}
                    placeholder={
                      activeSessionId
                        ? '続けて質問や要望を入力してください...'
                        : '左側のリストからセッションを選択してください。'
                    }
                    rows={1}
                    className="flex-1 min-h-[3rem] max-h-32 resize-none rounded-xl border border-gold/25 dark:border-gold/20 bg-white/90 dark:bg-slate-900/70 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition"
                  />
                  <Button
                    onClick={() => void handleSendMessage()}
                    disabled={!activeSessionId || assistantThinking || !messageInput.trim()}
                    size="sm"
                    className="absolute right-2 bottom-2 aria-gold-surface h-9 w-9 rounded-full flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {DEFAULT_QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!activeSessionId || assistantThinking}
                    onClick={() => void handleSendMessage(reply)}
                    className="border-gold/35 dark:border-gold/25 text-xs text-amber-700 dark:text-amber-200 hover:bg-gold/15 dark:hover:bg-slate-800 transition-all"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

