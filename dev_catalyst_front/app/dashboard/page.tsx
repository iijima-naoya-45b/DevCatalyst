'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Folder,
    Plus,
    Calendar,
    Clock,
    Activity,
    TrendingUp,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

// プロジェクトの型定義
interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'on-hold';
    createdAt: Date;
    updatedAt: Date;
    milestonesTotal: number;
    milestonesCompleted: number;
}

// サンプルプロジェクトデータ
const sampleProjects: Project[] = [
    {
        id: '1',
        name: 'ECサイト立ち上げプロジェクト',
        description: 'オーガニック食品に特化したECサイトの立ち上げと運営',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-01'),
        milestonesTotal: 10,
        milestonesCompleted: 6
    },
    {
        id: '2',
        name: 'AIチャットボット開発',
        description: '顧客サポート向けAIチャットボットの開発と導入',
        status: 'active',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-10-28'),
        milestonesTotal: 8,
        milestonesCompleted: 3
    },
    {
        id: '3',
        name: 'マーケティング戦略立案',
        description: 'SNS活用による新規顧客獲得のための戦略立案',
        status: 'completed',
        createdAt: new Date('2023-11-10'),
        updatedAt: new Date('2024-08-15'),
        milestonesTotal: 5,
        milestonesCompleted: 5
    },
    {
        id: '4',
        name: 'モバイルアプリ開発',
        description: 'iOS/Android対応のネイティブアプリケーション開発',
        status: 'active',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-10-30'),
        milestonesTotal: 12,
        milestonesCompleted: 4
    },
    {
        id: '5',
        name: 'データ分析基盤構築',
        description: 'ビッグデータ分析のためのインフラ整備',
        status: 'on-hold',
        createdAt: new Date('2024-04-10'),
        updatedAt: new Date('2024-09-15'),
        milestonesTotal: 7,
        milestonesCompleted: 2
    }
];

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [projects] = useState<Project[]>(sampleProjects);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [isAuthenticated, router]);

    const getProjectStatusBadge = (status: Project['status']) => {
        switch (status) {
            case 'active':
                return { text: '進行中', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
            case 'completed':
                return { text: '完了', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' };
            case 'on-hold':
                return { text: '保留', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' };
            default:
                return { text: 'その他', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300' };
        }
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/dashboard/${projectId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                            プロジェクト
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            すべてのプロジェクトを管理
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push('/dashboard/projects/new')}
                        className="bg-gradient-to-r from-gold via-gold-light to-bronze hover:from-gold-light hover:via-gold hover:to-gold text-navy-deepest font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        新規プロジェクト
                    </Button>
                </div>

                {/* 統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">総プロジェクト数</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">進行中</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {projects.filter(p => p.status === 'active').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">完了</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {projects.filter(p => p.status === 'completed').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">保留中</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {projects.filter(p => p.status === 'on-hold').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* プロジェクト一覧 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
                        プロジェクト一覧
                    </h2>

                    {projects.length === 0 ? (
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardContent className="py-12 text-center">
                                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    まだプロジェクトがありません
                                </p>
                                <Button 
                                    onClick={() => router.push('/dashboard/projects/new')}
                                    className="bg-gradient-to-r from-gold via-gold-light to-bronze hover:from-gold-light hover:via-gold hover:to-gold text-navy-deepest"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    最初のプロジェクトを作成
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <Card 
                                    key={project.id}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20 hover:border-gold/40 transition-all duration-300 cursor-pointer group"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
                                                    <Folder className="h-6 w-6 text-gold" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-serif text-gray-900 dark:text-white group-hover:text-gold transition-colors">
                                                        {project.name}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* ステータスと日付 */}
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <Badge className={getProjectStatusBadge(project.status).className}>
                                                    {getProjectStatusBadge(project.status).text}
                                                </Badge>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {project.createdAt.toLocaleDateString('ja-JP')}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {project.updatedAt.toLocaleDateString('ja-JP')}
                                                </div>
                                            </div>

                                            {/* 進捗バー */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        マイルストーン進捗
                                                    </span>
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {project.milestonesCompleted} / {project.milestonesTotal}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-gold via-gold-light to-bronze h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(project.milestonesCompleted / project.milestonesTotal) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
