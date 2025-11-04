'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Loader2, 
    User, 
    Settings, 
    Target,
    CheckCircle,
    BarChart3,
    Clock,
    Folder,
    Plus,
    Calendar,
    Activity,
    ArrowRight,
    TrendingUp,
    Users,
    Zap,
    Lock,
    MessageCircle,
    Lightbulb,
    Brain,
    ChevronRight,
    Eye,
    EyeOff,
    ArrowLeft,
    DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { User as UserType } from '@/lib/auth';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

// Chart.jsの登録
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
    }
];

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.id as string;
    const { isAuthenticated, user: cachedUser, apiClient } = useAuth();
    const [user, setUser] = useState<UserType | null>(cachedUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showCharts, setShowCharts] = useState(true);

    // プロジェクトデータを取得
    useEffect(() => {
        const foundProject = sampleProjects.find(p => p.id === projectId);
        setProject(foundProject || null);
        setLoading(false);
    }, [projectId]);

    // レーダーチャートデータ
    const radarChartData = {
        labels: ['市場性', '実現性', '収益性', '競争力', '成長性', 'リスク'],
        datasets: [
            {
                label: '評価スコア',
                data: [85, 72, 90, 68, 78, 65],
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderColor: 'rgba(212, 175, 55, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(212, 175, 55, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(212, 175, 55, 1)'
            }
        ]
    };

    // 棒グラフデータ
    const barChartData = {
        labels: ['市場機会', '技術力', '収益性', '競争優位'],
        datasets: [
            {
                label: 'スコア',
                data: [85, 75, 78, 68],
                backgroundColor: 'rgba(212, 175, 55, 0.6)',
                borderColor: 'rgba(212, 175, 55, 1)',
                borderWidth: 1
            }
        ]
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated()) {
                router.push('/login');
                return;
            }

            if (!cachedUser) {
                try {
                    const currentUser = await apiClient.getCurrentUser();
                    setUser(currentUser);
                } catch (err) {
                    setError('ユーザー情報の取得に失敗しました');
                    console.error('Failed to fetch user:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, cachedUser, apiClient, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Alert variant="destructive">
                    <AlertDescription>プロジェクトが見つかりませんでした</AlertDescription>
                </Alert>
                <Button 
                    onClick={() => router.push('/dashboard')}
                    className="mt-4"
                    variant="outline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ダッシュボードに戻る
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* 戻るボタン */}
                <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="ghost"
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    プロジェクト一覧に戻る
                </Button>

                {/* プロジェクトヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Folder className="h-10 w-10 text-gold" />
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                                {project.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                {project.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-gold/10 text-gold border-gold">MVP範囲</Badge>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            設定
                        </Button>
                    </div>
                </div>

                {/* MVP Scope Card */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-gold" />
                                <CardTitle className="text-xl font-serif text-gray-900 dark:text-white">
                                    MVP (最小実用製品) スコープ
                                </CardTitle>
                                <Badge variant="destructive" className="text-xs">重要</Badge>
                            </div>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            現在、devCatalystは最も重要なコア機能に集中しています。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-gray-900 dark:text-white">AI対話・分析</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600" />
                                <span className="text-gray-500 dark:text-gray-400">複数プロジェクト</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-gray-900 dark:text-white">戦略キャンバス</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600" />
                                <span className="text-gray-500 dark:text-gray-400">詳細心理分析</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-gray-900 dark:text-white">SWOT分析</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600" />
                                <span className="text-gray-500 dark:text-gray-400">行動経済学</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Welcome Card */}
                <Card className="bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-yellow-50/95 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 border-gold/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                    <Lightbulb className="h-6 w-6 text-gold mr-2" />
                                    ようこそ、devCatalystへ！
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    あなたの事業戦略の方向性と、今すぐやるべきことが一目でわかります。<br />
                                    まずはAIアリアと対話して、あなたのビジネスについて教えてください。
                                </p>
                                <Button className="bg-gradient-to-r from-gold via-gold-light to-bronze hover:from-gold-light hover:via-gold hover:to-gold text-navy-deepest font-medium shadow-md hover:shadow-lg transition-all duration-300">
                                    <Brain className="mr-2 h-4 w-4" />
                                    アリアと対話を始める
                                </Button>
                            </div>
                            <Brain className="h-16 w-16 text-gold opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">月次売上</CardTitle>
                                <DollarSign className="h-4 w-4 text-gold" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">¥832万</div>
                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                前月比+27.6%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">顧客数</CardTitle>
                                <Users className="h-4 w-4 text-gold" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1,081社</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">継続利用率 85%</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">プロジェクト進捗</CardTitle>
                                <Activity className="h-4 w-4 text-gold" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">67%</div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-gold via-gold-light to-bronze h-2 rounded-full" style={{ width: '67%' }} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gold/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">連続ログイン</CardTitle>
                                <Clock className="h-4 w-4 text-gold" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">9日</div>
                            <p className="text-sm text-gold">素晴らしい継続力！</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Workflow Steps */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif text-gray-900 dark:text-white">ステップバイステップガイド</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { step: 1, title: 'AIアリアと対話', description: 'ビジネスについて相談', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700' },
                                { step: 2, title: '分析を確認', description: 'SWOT・心理・競合分析', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' },
                                { step: 3, title: '戦略を立てる', description: '方向性とポジショニング', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700' },
                                { step: 4, title: 'アクション実行', description: '優先度順に実行', color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' }
                            ].map((item) => (
                                <div key={item.step} className={`p-4 rounded-lg border-2 ${item.color}`}>
                                    <div className="font-bold text-gray-900 dark:text-white mb-1">ステップ{item.step}</div>
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* To-Do Card */}
                <Card className="bg-gradient-to-br from-gold/10 to-bronze/10 dark:from-gold/5 dark:to-bronze/5 border-gold/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                    今すぐやるべきこと
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    まずはAIアリアと対話して、あなたのビジネスの状況を共有しましょう。分析結果を元に、最適な戦略とアクションプランを提案します。
                                </p>
                                <Button variant="outline" className="border-gold hover:bg-gold/10">
                                    対話を始める
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: '概要', badge: 'MVP' },
                        { id: 'analysis', label: '分析レポート', badge: 'MVP' },
                        { id: 'canvas', label: '戦略キャンバス', badge: 'MVP' },
                        { id: 'swot', label: 'SWOT分析', badge: 'MVP' },
                        { id: 'target', label: 'ターゲット分析', badge: '後回し' },
                        { id: 'psychology', label: '心理分析', badge: '後回し' },
                        { id: 'behavioral', label: '行動経済学', badge: '後回し' },
                        { id: 'action', label: 'アクション', badge: 'MVP' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'text-gold border-b-2 border-gold'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {tab.label}
                            <Badge variant={tab.badge === 'MVP' ? 'default' : 'secondary'} className="text-xs">
                                {tab.badge}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* AI Strategy Advisor */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gold/10 rounded-full">
                                    <Brain className="h-8 w-8 text-gold" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">AI戦略アドバイザー</h3>
                                    <p className="text-gray-600 dark:text-gray-400">アリアとの対話型分析で、あなたのビジネス戦略を深化させましょう</p>
                                </div>
                            </div>
                            <Button className="bg-gradient-to-r from-gold via-gold-light to-bronze hover:from-gold-light hover:via-gold hover:to-gold text-navy-deepest">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                アリアと対話する
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Analysis Visualization */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-serif text-gray-900 dark:text-white">分析結果を可視化</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                                    図表で戦略を直感的に把握し、説得力を審査しましょう
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCharts(!showCharts)}
                            >
                                {showCharts ? (
                                    <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        図表を非表示
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        図表を表示
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    {showCharts && (
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Radar Chart */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">総合評価スコア</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">6つの評価軸によるAI分析結果</p>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Radar data={radarChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">市場性:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">85</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">収益性:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">78</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">成長性:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">90</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">実現性:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">72</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">競争力:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">65</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">リスク:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">70</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">カテゴリ別評価</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">主要4領域の詳細スコア</p>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Bar data={barChartData} options={{ maintainAspectRatio: false, responsive: true, indexAxis: 'y' }} />
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">市場機会:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">85/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">技術力:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">75/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">収益性:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">78/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">競争優位:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">68/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
