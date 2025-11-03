'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Loader2, 
    LogOut, 
    User, 
    Settings, 
    Brain,
    Target,
    TrendingUp,
    Zap,
    CheckCircle,
    BarChart3,
    Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import type { User as UserType } from '@/lib/auth';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, user: cachedUser, logout, apiClient } = useAuth();
    const [user, setUser] = useState<UserType | null>(cachedUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthAndLoadUser = async () => {            
            if (!isAuthenticated()) {                router.push('/login?redirect=/dashboard');
                return;
            }            
            // まずキャッシュされたユーザー情報を使用
            if (cachedUser) {                setUser(cachedUser);
                setLoading(false);
            }

            // サーバーから最新のユーザー情報を取得
            try {
                setLoading(true);
                const userData = await apiClient.getCurrentUser();                setUser(userData);
                setError(null);
            } catch (err) {                
                // キャッシュされたユーザー情報がある場合はそれを使用
                if (cachedUser) {                    setUser(cachedUser);
                    setError(null);
                } else {
                    setError('Failed to load user data');
                    
                    // 認証エラーの場合はログインページにリダイレクト
                    if (err instanceof Error && (err.message.includes('401') || err.message.includes('Unauthorized'))) {                        router.push('/login?redirect=/dashboard');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadUser();
    }, [router, apiClient, isAuthenticated, cachedUser]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (err) {            // エラーが発生してもログインページにリダイレクト
            router.push('/login');
        }
    };

    const getPlanBadgeColor = (plan: string) => {
        switch (plan) {
            case 'premium':
                return 'bg-purple-100 text-purple-800';
            case 'standard':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end dark:bg-gradient-to-b dark:from-navy-main dark:via-navy-secondary dark:to-navy-card">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-gold" />
                    <p className="text-slate-700 dark:text-gray-300 font-serif text-lg">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end dark:bg-gradient-to-b dark:from-navy-main dark:via-navy-secondary dark:to-navy-card">
                <Alert variant="destructive" className="max-w-md glass-effect">
                    <AlertDescription>
                        {error || 'Failed to load user data'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end dark:bg-gradient-to-b dark:from-navy-main dark:via-navy-secondary dark:to-navy-card">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none dark:from-gold/30 dark:via-cyan/10 dark:to-gold/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Header */}
            <header className="relative z-10 p-4 bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end text-slate-800 border-b border-slate-300 shadow-lg dark:bg-navy-main dark:text-foreground dark:border-gold/30 glass-effect">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-lg dark:bg-gold subtle-glow">
                            <Brain className="w-6 h-6 text-white dark:text-navy-main" />
                        </div>
                        <h1 className="text-lg font-bold font-serif text-dark-enhanced dark:text-gold">devCatalyst</h1>
                    </div>

                    <nav className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-effect">
                            <Avatar className="h-8 w-8 border-2 border-gold/50">
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback className="bg-gold/20 text-gold-enhanced">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{user.name}</span>
                        </div>

                        <ThemeToggle />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-slate-700 hover:text-gold-enhanced dark:text-gray-300 dark:hover:text-gold hover:bg-gold/10"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            ログアウト
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent dark:from-gold dark:via-gold-light dark:to-gold">
                            おかえりなさい、{user.name.split(' ')[0]} さん
                        </h2>
                        <p className="text-lg text-slate-700 dark:text-gray-300">
                            あなたの戦略を加速させる準備ができています
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="glass-effect border-gold/30 hover:border-gold/50 transition-all duration-300 hover:shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Target className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">進行中のプロジェクト</p>
                                        <p className="text-2xl font-bold text-gold-enhanced">3</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-effect border-gold/30 hover:border-gold/50 transition-all duration-300 hover:shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">完了した分析</p>
                                        <p className="text-2xl font-bold text-gold-enhanced">12</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-effect border-gold/30 hover:border-gold/50 transition-all duration-300 hover:shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">AI提案数</p>
                                        <p className="text-2xl font-bold text-gold-enhanced">48</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-effect border-gold/30 hover:border-gold/50 transition-all duration-300 hover:shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">節約時間</p>
                                        <p className="text-2xl font-bold text-gold-enhanced">24h</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <Card className="glass-effect border-gold/30">
                            <CardHeader className="border-b border-gold/20">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gold" />
                                    <CardTitle className="text-lg font-serif text-gold-enhanced">プロフィール</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="h-20 w-20 border-4 border-gold/50">
                                        <AvatarImage src={user.avatar_url} alt={user.name} />
                                        <AvatarFallback className="bg-gold/20 text-gold-enhanced text-2xl">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <p className="font-bold text-lg text-slate-800 dark:text-gray-200">{user.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gold/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-gray-400">プラン:</span>
                                        <Badge className={getPlanBadgeColor(user.plan)}>
                                            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-gray-400">ステータス:</span>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                            アクティブ
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-gray-400">登録日:</span>
                                        <span className="text-sm text-slate-700 dark:text-gray-300">
                                            {new Date(user.created_at).toLocaleDateString('ja-JP')}
                                        </span>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full mt-4 border-gold/30 hover:bg-gold/10 hover:border-gold">
                                    <Settings className="h-4 w-4 mr-2" />
                                    アカウント設定
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions & Progress */}
                        <Card className="lg:col-span-2 glass-effect border-gold/30">
                            <CardHeader className="border-b border-gold/20">
                                <div className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5 text-gold" />
                                    <CardTitle className="text-lg font-serif text-gold-enhanced">はじめの一歩</CardTitle>
                                </div>
                                <CardDescription className="text-slate-600 dark:text-gray-400">
                                    DevCatalystを最大限に活用するためのステップ
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gold/5 border border-gold/20">
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200">アカウント作成完了</h3>
                                            <p className="text-sm text-slate-600 dark:text-gray-400">OAuth認証が完了し、アカウントが有効化されました</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
                                        <div className="h-6 w-6 rounded-full border-2 border-slate-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200">プロフィールを完成させる</h3>
                                            <p className="text-sm text-slate-600 dark:text-gray-400">より最適な戦略提案のため、詳細情報を設定しましょう</p>
                                            <Button variant="link" className="p-0 h-auto mt-2 text-gold hover:text-gold-light">
                                                プロフィール設定へ →
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
                                        <div className="h-6 w-6 rounded-full border-2 border-slate-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200">最初の戦略分析を実行</h3>
                                            <p className="text-sm text-slate-600 dark:text-gray-400">AIパートナー "Vertex" があなたの戦略を分析します</p>
                                            <Button variant="link" className="p-0 h-auto mt-2 text-gold hover:text-gold-light">
                                                戦略分析を開始 →
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
                                        <div className="h-6 w-6 rounded-full border-2 border-slate-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200">機能を探索する</h3>
                                            <p className="text-sm text-slate-600 dark:text-gray-400">ターゲット分析、戦略マップ、行動UX分析などを試してみましょう</p>
                                            <Button variant="link" className="p-0 h-auto mt-2 text-gold hover:text-gold-light">
                                                機能一覧を見る →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}