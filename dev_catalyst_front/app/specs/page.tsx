'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  FileText,
  Plus,
  Search,
  Trash2,
  Edit2,
  Download,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { specService, type Spec } from '@/lib/services/spec-service';
import { useAuth } from '@/contexts/auth-context';

const SPECS_PER_PAGE = 12;

export default function SpecsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [specs, setSpecs] = useState<Spec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingSpecId, setDeletingSpecId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specToDelete, setSpecToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadSpecs();
  }, [isAuthenticated, router]);

  const loadSpecs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedSpecs = await specService.getSpecs();
      setSpecs(loadedSpecs);
    } catch (err: any) {
      console.error('Failed to load specs:', err);
      setError(err.message || 'Spec一覧の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSpecs();
    setIsRefreshing(false);
  };

  const handleDeleteClick = (specId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpecToDelete(specId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!specToDelete) return;

    setDeletingSpecId(specToDelete);
    setErrorMessage(null);
    try {
      await specService.deleteSpec(specToDelete);
      setSpecs(specs.filter((s) => s.id !== specToDelete));
      setDeleteDialogOpen(false);
      setSpecToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete spec:', err);
      setErrorMessage(err.message || 'Specの削除に失敗しました');
    } finally {
      setDeletingSpecId(null);
    }
  };

  const handleEdit = (specId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/specs/new?spec_id=${specId}`);
  };

  const filteredSpecs = useMemo(() => {
    if (!searchTerm.trim()) {
      return specs;
    }

    const keyword = searchTerm.trim().toLowerCase();
    return specs.filter((spec) => {
      const titleMatch = spec.title?.toLowerCase().includes(keyword);
      const descriptionMatch = spec.description?.toLowerCase().includes(keyword);
      return titleMatch || descriptionMatch;
    });
  }, [specs, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredSpecs.length / SPECS_PER_PAGE));
  const paginatedSpecs = useMemo(() => {
    const start = (currentPage - 1) * SPECS_PER_PAGE;
    return filteredSpecs.slice(start, start + SPECS_PER_PAGE);
  }, [filteredSpecs, currentPage]);

  const getStatusBadge = (status: Spec['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            完了
          </span>
        );
      case 'generating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            生成中
          </span>
        );
      case 'exported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Download className="h-3 w-3" />
            エクスポート済み
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            <Clock className="h-3 w-3" />
            下書き
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-gold" />
            <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
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
            <AlertDialogTitle>Specを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。このSpecと関連するセクションが完全に削除されます。
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
                setSpecToDelete(null);
                setErrorMessage(null);
              }}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletingSpecId !== null}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingSpecId !== null ? (
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

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Spec一覧
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {filteredSpecs.length}件のSpec
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <Loader2 className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              更新
            </Button>
            <Button onClick={() => router.push('/specs/new')} className="aria-gold-surface">
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Specを検索..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {filteredSpecs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? '該当するSpecが見つかりませんでした' : 'Specがありません'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? '別のキーワードでお試しください' : '新しいSpecを作成して始めましょう'}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push('/specs/new')} className="aria-gold-surface">
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Specグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {paginatedSpecs.map((spec) => (
              <Card
                key={spec.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-gold/20 hover:border-gold/40"
                onClick={() => router.push(`/specs/new?spec_id=${spec.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {spec.title || '無題のSpec'}
                    </CardTitle>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEdit(spec.id, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(spec.id, e)}
                        disabled={deletingSpecId === spec.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {deletingSpecId === spec.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {spec.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                      {spec.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* ステータス */}
                    <div className="flex items-center justify-between">
                      {getStatusBadge(spec.status)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {spec.completion_percentage}%
                      </span>
                    </div>

                    {/* 進捗バー */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all duration-500"
                        style={{ width: `${spec.completion_percentage}%` }}
                      />
                    </div>

                    {/* メタ情報 */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(spec.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {spec.sections && spec.sections.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>{spec.sections.length}セクション</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
