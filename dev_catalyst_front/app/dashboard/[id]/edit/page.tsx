'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft,
    Save,
    Folder
} from 'lucide-react';

// サンプルプロジェクトデータ（実際にはAPIから取得）
const sampleProjects = [
    {
        id: '1',
        name: 'ECサイト立ち上げプロジェクト',
        description: 'オーガニック食品に特化したECサイトの立ち上げと運営。健康志向の高い顧客層をターゲットに、安心・安全な食品を提供するプラットフォームを構築します。',
        status: 'active' as 'active' | 'completed' | 'on-hold',
    },
    {
        id: '2',
        name: 'AIチャットボット開発',
        description: '顧客サポート向けAIチャットボットの開発と導入',
        status: 'active' as 'active' | 'completed' | 'on-hold',
    },
    {
        id: '3',
        name: 'マーケティング戦略立案',
        description: 'SNS活用による新規顧客獲得のための戦略立案',
        status: 'completed' as 'active' | 'completed' | 'on-hold',
    },
];

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active' as 'active' | 'completed' | 'on-hold'
    });

    useEffect(() => {
        // 実際にはAPIから取得
        const project = sampleProjects.find(p => p.id === projectId);
        if (project) {
            setFormData({
                name: project.name,
                description: project.description,
                status: project.status
            });
        }
    }, [projectId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: APIにデータを送信
        console.log('プロジェクト更新:', formData);
        // 詳細ページに戻る
        router.push(`/dashboard/${projectId}`);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                onClick={() => router.push(`/dashboard/${projectId}`)}
                                className="text-slate-700 dark:text-gray-300 hover:text-gold-enhanced dark:hover:text-gold hover:bg-gold/10 -ml-2"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                プロジェクト詳細に戻る
                            </Button>
                            <div className="flex items-center space-x-3">
                                <Folder className="h-8 w-8 text-gold" />
                                <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-gray-200">
                                    プロジェクトを編集
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* フォーム */}
                    <form onSubmit={handleSubmit}>
                        <Card className="glass-effect border-gold/30 bg-white/80 dark:bg-slate-800/80">
                            <CardHeader className="border-b border-gold/20">
                                <CardTitle className="text-2xl font-serif text-amber-700 dark:text-gold-light">
                                    プロジェクト基本情報
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-gray-200">
                                    プロジェクトの情報を編集してください
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* プロジェクト名 */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-800 dark:text-white font-semibold">
                                        プロジェクト名 <span className="text-red-500 dark:text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="例: ECサイト立ち上げプロジェクト"
                                        className="bg-white/90 dark:bg-navy-medium border-gold/20 focus:border-gold dark:border-gold/20 dark:focus:border-gold"
                                    />
                                </div>

                                {/* 説明 */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-slate-800 dark:text-white font-semibold">
                                        プロジェクト説明 <span className="text-red-500 dark:text-red-400">*</span>
                                    </Label>
                                    <textarea
                                        id="description"
                                        required
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="プロジェクトの目的や概要を記入してください"
                                        rows={5}
                                        className="w-full px-3 py-2 bg-white/90 dark:bg-slate-800 border border-gold/20 focus:border-gold dark:border-gold/30 dark:focus:border-gold rounded-md text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </div>

                                {/* ステータス */}
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-slate-800 dark:text-white font-semibold">
                                        ステータス
                                    </Label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="active"
                                                checked={formData.status === 'active'}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className="w-4 h-4 text-gold border-gold/30 focus:ring-gold"
                                            />
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                                進行中
                                            </Badge>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="completed"
                                                checked={formData.status === 'completed'}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className="w-4 h-4 text-gold border-gold/30 focus:ring-gold"
                                            />
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                完了
                                            </Badge>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="on-hold"
                                                checked={formData.status === 'on-hold'}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className="w-4 h-4 text-gold border-gold/30 focus:ring-gold"
                                            />
                                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                                保留
                                            </Badge>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* アクションボタン */}
                        <div className="flex items-center justify-end space-x-4 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/dashboard/${projectId}`)}
                                className="border-gold/30 hover:bg-gold/10 hover:border-gold"
                            >
                                キャンセル
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light hover:shadow-lg hover:shadow-gold/30"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                変更を保存
                            </Button>
                        </div>
                    </form>
                </div>
        </div>
    );
}

