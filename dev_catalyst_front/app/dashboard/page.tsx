'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { specService } from '@/lib/services/spec-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  Clock,
  MessageCircle,
  Plus,
  Loader2,
  ChevronRight,
  Search,
  Send,
  List,
  Bot,
  Sparkles,
  X,
  Menu,
  FileText,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { aiService } from '@/lib/services';
import type { ChatSession, ChatRequest } from '@/lib/api/rails/ai';
import { withAuthToken } from '@/lib/hooks/use-auth-token';

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

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsRefreshing, setSessionsRefreshing] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [generatingSpecSessionId, setGeneratingSpecSessionId] = useState<number | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [activeSessionMeta, setActiveSessionMeta] = useState<ChatSession | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [messageInput, setMessageInput] = useState('');
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

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
      const data = await withAuthToken(() => aiService.getSessions(100));
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
        const sessionData = await withAuthToken(() => aiService.getSession(sessionId));

        if (!sessionData || !sessionData.messages) {
          setMessages([]);
          return;
        }

        const normalizedMessages: ConversationMessage[] = sessionData.messages.map(
          (message: any) => ({
            id: String(message.id),
            role: message.sender_role === 'aria' ? 'assistant' : 'user',
            content: message.content,
            createdAt: new Date(message.created_at),
          })
        );

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
    [sessions]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Textareaの自動リサイズ
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 高さをリセットしてからscrollHeightを取得
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // 最小高さ（3rem = 48px）と最大高さ（8rem = 128px）を適用
      const minHeight = 48; // min-h-[3rem]
      const maxHeight = 128; // max-h-32
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [messageInput]);

  const handleGenerateSpecFromSession = useCallback(
    async (sessionId: number) => {
      setGeneratingSpecSessionId(sessionId);
      try {
        const spec = await specService.createFromSession(sessionId);
        // 生成が完了したらSpecページに遷移
        router.push(`/specs/new?spec_id=${spec.id}`);
      } catch (error: any) {
        console.error('Spec generation error:', error);
        setErrorMessage(error.message || 'Specの生成に失敗しました');
      } finally {
        setGeneratingSpecSessionId(null);
      }
    },
    [router]
  );

  const handleDeleteSessionClick = useCallback((sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteSessionConfirm = useCallback(async () => {
    if (!sessionToDelete) return;

    setDeletingSessionId(sessionToDelete);
    setErrorMessage(null);
    try {
      await withAuthToken(() => aiService.deleteSession(sessionToDelete));
      // 削除されたセッションがアクティブな場合は、アクティブセッションをクリア
      if (activeSessionId === sessionToDelete) {
        setActiveSessionId(null);
        setActiveSessionMeta(null);
        setMessages([]);
      }
      // セッション一覧を再読み込み
      await loadSessions();
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete session:', error);
      setErrorMessage(error.message || 'セッションの削除に失敗しました');
    } finally {
      setDeletingSessionId(null);
    }
  }, [sessionToDelete, activeSessionId, loadSessions]);

  const handleSelectSession = useCallback(
    (session: ChatSession) => {
      setActiveSessionId(session.id);
      setActiveSessionMeta(session);
      setMessages([]);
      setMessagesError(null);
      void loadSessionMessages(session.id);
    },
    [loadSessionMessages]
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
      };

      try {
        await withAuthToken(() =>
          aiService.chatCompletionStream(requestPayload, activeSessionId, {
            onChunk: (chunk) => {
              collectedContent += chunk;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                        ...message,
                        content: message.content + chunk,
                      }
                    : message
                )
              );
            },
            onError: (errorMessage) => {
              setAssistantThinking(false);
              setMessagesError(errorMessage || 'ストリーミング中にエラーが発生しました。');
              setMessages((prev) => prev.filter((message) => message.id !== streamingMessageId));
            },
            onComplete: (sessionId) => {
              setAssistantThinking(false);
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === streamingMessageId
                    ? {
                        ...message,
                        content: collectedContent,
                        isStreaming: false,
                      }
                    : message
                )
              );

              void loadSessions();
            },
          })
        );
      } catch (error) {
        console.error(error);
        setAssistantThinking(false);
        setMessages((prev) => prev.filter((message) => message.id !== streamingMessageId));
        setMessagesError('会話の送信中にエラーが発生しました。時間をおいて再試行してください。');
      }
    },
    [activeSessionId, assistantThinking, loadSessions, messageInput, messages]
  );

  if (sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin gold-soft-text" />
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] w-full sm:w-[90%] lg:w-[80%] mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6">
      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <Alert variant="destructive" className="mb-3 sm:mb-4 relative text-xs sm:text-sm">
          <AlertDescription className="pr-8 text-xs sm:text-sm">{errorMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setErrorMessage(null)}
            className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 h-5 w-5 sm:h-6 sm:w-6 p-0"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Alert>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>セッションを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。このセッションと関連するメッセージ、Specが完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          {errorMessage && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSessionToDelete(null);
                setErrorMessage(null);
              }}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSessionConfirm}
              disabled={deletingSessionId !== null}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingSessionId !== null ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  削除中...
                </>
              ) : (
                '削除する'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-white">
            チャットセッション
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            アリアとの対話をセッションごとに整理し、次のアクションを素早く見つけましょう。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/specs/new')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Spec生成
          </Button>
          <Button
            onClick={() => router.push('/dashboard/projects/new')}
            className="aria-gold-surface font-medium shadow-md transition-all duration-300 !text-black"
          >
            <Plus className="mr-2 h-4 w-4 !text-black" />
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

      {/* スマホ: ドロワー（Portal経由でbody直下にレンダリング） */}
      {isMounted &&
        createPortal(
          <>
            {/* オーバーレイ */}
            {isDrawerOpen && (
              <div
                className="lg:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                onClick={() => setIsDrawerOpen(false)}
              />
            )}
            {/* ドロワー */}
            <div
              className={`lg:hidden fixed left-0 top-0 bottom-0 z-[60] w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gold/25">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    セッション一覧
                  </h2>
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
                      className="pl-9 rounded-lg"
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
                      {filteredSessions.map((session, index) => {
                        const isActive = session.id === activeSessionId;
                        return (
                          <div
                            key={session.id}
                            onClick={() => {
                              handleSelectSession(session);
                              setIsDrawerOpen(false);
                            }}
                            className={`w-full text-left rounded-lg border p-3 transition-all duration-300 cursor-pointer animate-slide-in-left ${
                              isActive
                                ? 'border-gold/60 bg-gold/10 shadow-md shadow-gold/10'
                                : 'border-gold/15 hover:border-gold/40 hover:bg-gold/10/70'
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationFillMode: 'both',
                            }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {session.title}
                              </span>
                              <span className="text-[11px] text-gray-600 dark:text-gray-400 flex-shrink-0">
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
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {session.messages_count} 件
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(session.last_interacted_at).toLocaleTimeString(
                                    'ja-JP',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                                {session.archived && (
                                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                    アーカイブ
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (
                                      !generatingSpecSessionId ||
                                      generatingSpecSessionId !== session.id
                                    ) {
                                      await handleGenerateSpecFromSession(session.id);
                                    }
                                  }}
                                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 px-2 ${generatingSpecSessionId === session.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {generatingSpecSessionId === session.id ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                      生成中...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-3.5 w-3.5 mr-1" />
                                      Spec生成
                                    </>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => handleDeleteSessionClick(session.id, e)}
                                  disabled={deletingSessionId === session.id}
                                  className={`inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 h-7 w-7 p-0 ${deletingSessionId === session.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-gray-500 dark:text-gray-400'}`}
                                  title="セッションを削除"
                                >
                                  {deletingSessionId === session.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* デスクトップ: セッション一覧サイドバー */}
        <Card className="hidden lg:block lg:w-64 xl:w-72 border border-gold/25 dark:border-gold/25 bg-white/90 dark:bg-slate-900/70 backdrop-blur">
          <CardHeader className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                セッション一覧
              </CardTitle>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {filteredSessions.length} 件
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="キーワードで検索..."
                className="pl-8 h-8 text-xs rounded-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {filteredSessions.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>該当するセッションが見つかりませんでした。</p>
                <p>別のキーワードでお試しください。</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
                {paginatedSessions.map((session, index) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`w-full text-left rounded-lg border p-2.5 transition-all duration-300 cursor-pointer animate-slide-in-left ${
                        isActive
                          ? 'border-gold/60 bg-gold/10 shadow-md shadow-gold/10'
                          : 'border-gold/15 hover:border-gold/40 hover:bg-gold/10/70'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 flex-1">
                          {session.title}
                        </span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5">
                          {new Date(session.last_interacted_at).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {session.last_message_preview && (
                        <p className="mt-1.5 line-clamp-1 text-[10px] text-gray-600 dark:text-gray-400 leading-snug">
                          {session.last_message_preview}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-[9px] text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <MessageCircle className="h-2.5 w-2.5" />
                            {session.messages_count}件
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {new Date(session.last_interacted_at).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {session.archived && (
                            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              アーカイブ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (
                                !generatingSpecSessionId ||
                                generatingSpecSessionId !== session.id
                              ) {
                                await handleGenerateSpecFromSession(session.id);
                              }
                            }}
                            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[9px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 px-2 ${generatingSpecSessionId === session.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {generatingSpecSessionId === session.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                生成中
                              </>
                            ) : (
                              <>
                                <FileText className="h-3 w-3 mr-1" />
                                Spec
                              </>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleDeleteSessionClick(session.id, e)}
                            disabled={deletingSessionId === session.id}
                            className={`inline-flex items-center justify-center rounded-md text-[9px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 h-6 w-6 p-0 ${deletingSessionId === session.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-gray-500 dark:text-gray-400'}`}
                            title="セッションを削除"
                          >
                            {deletingSessionId === session.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
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

        <Card className="flex-1 border border-gold/25 dark:border-gold/25 bg-white/90 dark:bg-slate-900/70 backdrop-blur">
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
          <CardContent className="flex flex-col h-[24rem] sm:h-[28rem] lg:h-[36rem]">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4 lg:space-y-5"
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
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-full rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-100 text-slate-900 dark:!text-slate-900'
                          : 'bg-white dark:bg-slate-900/80 text-gray-900 dark:text-amber-100 border border-gold/30'
                      } ${message.isStreaming ? 'animate-pulse' : ''}`}
                    >
                      <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-1.5 [&>ol]:mb-1.5 [&>li]:mb-0.5 [&>h1]:mb-1.5 [&>h2]:mb-1.5 [&>h3]:mb-1.5 [&>h4]:mb-1.5">
                        {message.content}
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-400">
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

            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
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
                    className="flex-1 min-h-[2.5rem] sm:min-h-[3rem] max-h-24 sm:max-h-32 resize-none rounded-lg border border-gold/25 dark:border-gold/20 bg-white/90 dark:bg-slate-900/70 px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition overflow-hidden"
                  />
                  <Button
                    onClick={() => void handleSendMessage()}
                    disabled={!activeSessionId || assistantThinking || !messageInput.trim()}
                    size="sm"
                    className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 aria-gold-surface h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!activeSessionId || assistantThinking}
                    onClick={() => void handleSendMessage(reply)}
                    className="border-gold/35 dark:border-gold/25 text-[11px] px-2.5 py-1 h-7 text-amber-700 dark:text-amber-200 hover:bg-gold/15 dark:hover:bg-slate-800 transition-all rounded-lg"
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
