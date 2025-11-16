'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Download, Sparkles, FileDown, MessageSquare, Brain, X } from 'lucide-react';
import { specService, type Spec, type SpecSection } from '@/lib/services/spec-service';
import { useAuth } from '@/contexts/auth-context';
import ReactMarkdown from 'react-markdown';

export default function NewSpecPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const specId = searchParams.get('spec_id');
  const { isAuthenticated } = useAuth();
  const [spec, setSpec] = useState<Spec | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [conversationMode, setConversationMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Array<{ role: 'user' | 'aria'; content: string }>>([]);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // spec_idが指定されている場合は既存のSpecを読み込む
    if (specId && !spec) {
      handleLoadSpec(Number(specId));
    }
    // セッションIDが指定されている場合は自動生成（後方互換性のため）
    else if (sessionId && !spec) {
      handleCreateFromSession(Number(sessionId));
    }
  }, [isAuthenticated, router, sessionId, specId]);

  const handleLoadSpec = async (id: number) => {
    setIsGenerating(true);
    try {
      const loadedSpec = await specService.getSpec(id);
      setSpec(loadedSpec);
      setCompletionPercentage(loadedSpec.completion_percentage);
      
      // 生成中の場合はポーリングで更新
      if (loadedSpec.status === 'generating') {
        pollSpecStatus(id);
      }
    } catch (error: any) {
      console.error('Spec load error:', error);
      setErrorMessage(error.message || 'Specの読み込みに失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollSpecStatus = (id: number) => {
    const interval = setInterval(async () => {
      try {
        const updatedSpec = await specService.getSpec(id);
        setSpec(updatedSpec);
        setCompletionPercentage(updatedSpec.completion_percentage);
        
        if (updatedSpec.status !== 'generating') {
          clearInterval(interval);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
    
    setTimeout(() => clearInterval(interval), 60000); // 60秒でタイムアウト
  };

  const handleCreateFromSession = async (sessionId: number) => {
    setIsGenerating(true);
    try {
      const newSpec = await specService.createFromSession(sessionId);
      setSpec(newSpec);
      setCompletionPercentage(newSpec.completion_percentage);
      
      // 生成が完了したらSpecページに遷移
      router.push(`/specs/new?spec_id=${newSpec.id}`);
      
      // セクションが生成されるまで待機して更新
      if (newSpec.status === 'generating') {
        pollSpecStatus(newSpec.id);
      }
    } catch (error: any) {
      console.error('Spec creation from session error:', error);
      setErrorMessage(error.message || 'Specの作成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateSpec = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    try {
      const newSpec = await specService.createSpec({
        title: userInput.trim(),
        description: '新規作成',
        format: 'markdown',
      });
      setSpec(newSpec);
      setCompletionPercentage(newSpec.completion_percentage);
      setUserInput('');
    } catch (error: any) {
      console.error('Spec creation error:', error);
      setErrorMessage(error.message || 'Specの作成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartConversation = async () => {
    if (!spec) return;

    setIsGenerating(true);
    try {
      const result = await specService.startConversation(spec.id);
      setCurrentQuestion(result.question);
      setConversationMode(true);
      setConversationMessages([
        { role: 'aria', content: result.question }
      ]);
      setSpec(result.spec);
      setCompletionPercentage(result.spec.completion_percentage);
      
      // 会話エリアをスクロール
      setTimeout(() => {
        if (conversationRef.current) {
          conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
      }, 100);
    } catch (error: any) {
      console.error('Conversation start error:', error);
      setErrorMessage(error.message || '対話の開始に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRespondToQuestion = async () => {
    if (!spec || !userInput.trim() || !currentQuestion) return;

    const userResponse = userInput.trim();
    setUserInput('');
    setIsComposing(false);

    // ユーザーメッセージを追加
    setConversationMessages(prev => [...prev, { role: 'user', content: userResponse }]);

    setIsGenerating(true);
    try {
      const result = await specService.respondToQuestion(spec.id, userResponse);
      
      setSpec(result.spec);
      setCompletionPercentage(result.completion_percentage);
      
      // 次の質問を追加
      if (result.question) {
        setCurrentQuestion(result.question);
        setConversationMessages(prev => [...prev, { role: 'aria', content: result.question! }]);
      } else {
        setCurrentQuestion(null);
        setConversationMessages(prev => [...prev, { role: 'aria', content: 'ありがとうございます！Specの生成が完了しました。' }]);
      }
      
      // プレビューをスクロール
      if (previewRef.current) {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
      }
      
      // 会話エリアをスクロール
      setTimeout(() => {
        if (conversationRef.current) {
          conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
      }, 100);
    } catch (error: any) {
      console.error('Response error:', error);
      setErrorMessage(error.message || '回答の処理に失敗しました');
      // エラー時はユーザーメッセージを削除
      setConversationMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async (sectionType: string) => {
    if (!spec) return;

    setIsGenerating(true);
    try {
      const result = await specService.generateSection(spec.id, {
        section_type: sectionType,
        user_input: userInput,
      });
      setSpec(result.spec);
      setCompletionPercentage(result.spec.completion_percentage);
      setUserInput('');
      
      // プレビューをスクロール
      if (previewRef.current) {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
      }
    } catch (error: any) {
      console.error('Section generation error:', error);
      setErrorMessage(error.message || 'セクションの生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = async () => {
    if (!spec) return;

    try {
      const result = await specService.exportMarkdown(spec.id);
      
      // Markdownファイルをダウンロード
      const blob = new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${spec.title.replace(/\s+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      setErrorMessage(error.message || 'エクスポートに失敗しました');
    }
  };

  const handleExportPdf = async () => {
    if (!spec) return;

    try {
      const result = await specService.exportPdf(spec.id);
      
      // HTMLをPDFに変換（ブラウザの印刷機能を使用）
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setErrorMessage('ポップアップがブロックされています。ブラウザの設定を確認してください。');
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${result.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            h1 { font-size: 2em; margin-top: 0; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { font-size: 1.5em; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            h3 { font-size: 1.2em; margin-top: 20px; }
            ul { margin: 10px 0; padding-left: 30px; }
            li { margin: 5px 0; }
            li.task { list-style: none; }
            p { margin: 10px 0; }
            @media print {
              body { margin: 0; padding: 15px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${result.html}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // 印刷ダイアログを表示（PDFとして保存可能）
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error: any) {
      console.error('PDF export error:', error);
      setErrorMessage(error.message || 'PDFエクスポートに失敗しました');
    }
  };

  const sectionTypes = [
    { type: 'overview', label: 'プロジェクト概要', required: true },
    { type: 'target', label: 'ターゲットユーザー', required: true },
    { type: 'features', label: '機能要件', required: true },
    { type: 'technical_stack', label: '技術スタック', required: false },
    { type: 'schedule', label: 'スケジュール', required: false },
  ];

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
          Spec Generator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          AIとの対話を通じて、プロジェクトの仕様書を自動生成します
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
        {/* 左: 対話エリア */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Spec作成</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {!spec ? (
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (isComposing) return;
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateSpec();
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="プロジェクトのタイトルを入力してください..."
                  rows={3}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleCreateSpec}
                  disabled={!userInput.trim() || isGenerating}
                  className="aria-gold-surface"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      作成中...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Specを作成
                    </>
                  )}
                </Button>
              </div>
            ) : conversationMode ? (
              <div className="flex-1 flex flex-col space-y-4">
                {/* 会話エリア */}
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg" ref={conversationRef}>
                  {conversationMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-100 text-slate-900 dark:!text-slate-900'
                            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-amber-100 border border-gold/30'
                        }`}
                      >
                        {message.role === 'aria' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-4 w-4 text-gold" />
                            <span className="text-xs font-semibold">Aria</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 border border-gold/30">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-gold" />
                          <Loader2 className="h-4 w-4 animate-spin text-gold" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">考え中...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 入力エリア */}
                <div className="space-y-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (isComposing) return;
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleRespondToQuestion();
                      }
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder={currentQuestion ? "回答を入力してください..." : "対話が完了しました"}
                    rows={3}
                    className="min-h-[80px]"
                    disabled={!currentQuestion || isGenerating}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRespondToQuestion}
                      disabled={!userInput.trim() || !currentQuestion || isGenerating}
                      className="aria-gold-surface"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          送信中...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          送信
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConversationMode(false);
                        setCurrentQuestion(null);
                        setConversationMessages([]);
                      }}
                    >
                      手動生成に切り替え
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={handleStartConversation}
                    disabled={isGenerating}
                    className="aria-gold-surface flex-1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    対話形式で生成
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">セクション生成</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {sectionTypes.map((section) => {
                      const existingSection = spec.sections?.find(
                        (s) => s.section_type === section.type
                      );
                      return (
                        <Button
                          key={section.type}
                          variant={existingSection ? 'outline' : 'default'}
                          onClick={() => handleGenerateSection(section.type)}
                          disabled={isGenerating}
                          className="justify-start"
                        >
                          {existingSection ? (
                            <>
                              <span className="mr-2">✓</span>
                              {section.label} (完了)
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              {section.label}
                              {section.required && <span className="ml-2 text-xs">必須</span>}
                            </>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">追加情報</h3>
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (isComposing) return;
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="セクション生成時に使用する追加情報を入力..."
                    rows={3}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSpec(null);
                      setUserInput('');
                      setCompletionPercentage(0);
                      setConversationMode(false);
                      setCurrentQuestion(null);
                      setConversationMessages([]);
                    }}
                  >
                    新規作成
                  </Button>
                  <Button
                    onClick={handleExportMarkdown}
                    disabled={!spec.markdown_content}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Markdown
                  </Button>
                  <Button
                    onClick={handleExportPdf}
                    disabled={!spec.markdown_content}
                    className="aria-gold-surface"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右: プレビュー */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>プレビュー</CardTitle>
              {spec && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completionPercentage}%
                </span>
              )}
            </div>
            {spec && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto" ref={previewRef}>
            {spec ? (
              <div className="prose dark:prose-invert max-w-none">
                {spec.markdown_content ? (
                  <ReactMarkdown>{spec.markdown_content}</ReactMarkdown>
                ) : (
                  <div className="space-y-4">
                    <h1>{spec.title}</h1>
                    {spec.sections?.map((section) => (
                      <div key={section.id} className="border-l-4 border-gold pl-4">
                        <h2>{section.title}</h2>
                        {section.content && (
                          <div className="whitespace-pre-wrap">{section.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>左側でSpecを作成してください</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

