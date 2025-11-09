'use client';

import { useState } from 'react';
import { Brain, TrendingUp, Users, Target, Zap, CheckCircle, XCircle, ArrowRight, AlertTriangle, Clock, DollarSign, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '../common/ui/card';
import { Badge } from '../common/ui/badge';
import { useInView } from '../../hooks/use-in-view';

// 5セグメント分析フレームワーク
const fiveSegs = [
  {
    segment: '市場',
    icon: TrendingUp,
    traditional: '手探りで調査、時間がかかる',
    devCatalyst: 'Ariaが即座に市場規模・トレンド分析',
    color: 'from-blue-500 to-blue-600',
  },
  {
    segment: '競合',
    icon: Users,
    traditional: '競合サービスを1つずつ調査',
    devCatalyst: '差別化ポイントを自動抽出',
    color: 'from-purple-500 to-purple-600',
  },
  {
    segment: '顧客',
    icon: Target,
    traditional: 'ペルソナ作成に数日',
    devCatalyst: '対話からニーズを自動分析',
    color: 'from-pink-500 to-pink-600',
  },
  {
    segment: '自社',
    icon: Lightbulb,
    traditional: '強みが不明確なまま開発',
    devCatalyst: 'MVP範囲を最適化',
    color: 'from-green-500 to-green-600',
  },
  {
    segment: '協力者',
    icon: Users,
    traditional: 'エンジニア探しに苦労',
    devCatalyst: '技術選定で適切なパートナー探し',
    color: 'from-orange-500 to-orange-600',
  },
];

// 行動経済学の原理
const behavioralEconomics = [
  {
    principle: '損失回避',
    icon: AlertTriangle,
    problem: '失敗への恐れで動けない',
    solution: '14日間無料で試せるから、リスクゼロで始められる',
    impact: '心理的ハードルを80%削減',
  },
  {
    principle: 'アンカリング効果',
    icon: DollarSign,
    problem: '開発費300万円という高額なアンカー',
    solution: '月額¥2,480という低額アンカーで比較',
    impact: '99%のコスト削減を実感',
  },
  {
    principle: 'サンクコスト回避',
    icon: Clock,
    problem: '長期開発で途中で諦められない',
    solution: '小さく始めて、段階的に拡張',
    impact: '失敗しても損失は最小限',
  },
  {
    principle: '即時フィードバック',
    icon: Zap,
    problem: '結果が見えるまで数ヶ月',
    solution: 'Ariaとの対話で即座に戦略が見える',
    impact: 'モチベーション維持率90%以上',
  },
];

// 比較表データ
const comparison = {
  従来の方法: {
    approach: [
      { label: '市場調査', value: '自力で数週間', negative: true },
      { label: '技術選定', value: '試行錯誤で迷走', negative: true },
      { label: '戦略立案', value: 'コンサル費用50万円〜', negative: true },
      { label: 'MVP開発', value: '外注で300万円〜', negative: true },
      { label: '開始までの期間', value: '3〜6ヶ月', negative: true },
      { label: '成功率', value: '約20%', negative: true },
    ],
    psychology: '損失回避バイアスで動けない',
  },
  'AI開発ツール': {
    approach: [
      { label: '市場調査', value: '手動で実施', negative: true },
      { label: '技術選定', value: 'コード生成のみ', negative: true },
      { label: '戦略立案', value: 'サポートなし', negative: true },
      { label: 'MVP開発', value: 'コーディング支援のみ', negative: false },
      { label: '開始までの期間', value: '1〜2ヶ月', negative: false },
      { label: '成功率', value: '約40%', negative: false },
    ],
    psychology: '技術優先で市場ニーズを見失う',
  },
  DevCatalyst: {
    approach: [
      { label: '市場調査', value: 'Ariaが即座に分析', negative: false },
      { label: '技術選定', value: 'AI推奨で最適化', negative: false },
      { label: '戦略立案', value: '対話で自動生成', negative: false },
      { label: 'MVP開発', value: '明確な設計書で効率化', negative: false },
      { label: '開始までの期間', value: '即日〜1週間', negative: false },
      { label: '成功率', value: '約78%', negative: false },
    ],
    psychology: 'スモールステップで心理的安全性を確保',
  },
};

export function DifferentiationSection() {
  const [activeTab, setActiveTab] = useState<'comparison' | '5segs' | 'behavioral'>('comparison');
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className={`text-center mb-12 fade-in-up ${isInView ? 'in-view' : ''}`}>
          <Badge className="gold-soft-gradient text-aria-dark-soft mb-4 shadow-sm">
            DIFFERENTIATION
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
            なぜ、DevCatalystは違うのか？
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            行動経済学と戦略フレームワークに基づいた、<br />
            科学的なアプローチで、あなたのプロダクト成功を支援します。
          </p>
        </div>

        {/* タブ */}
        <div className={`flex justify-center gap-4 mb-12 flex-wrap fade-in-up ${isInView ? 'in-view delay-200' : ''}`}>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${activeTab === 'comparison'
                ? 'aria-gold-surface shadow-lg shadow-gold/30'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }
            `}
          >
            3者比較
          </button>
          <button
            onClick={() => setActiveTab('5segs')}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${activeTab === '5segs'
                ? 'aria-gold-surface shadow-lg shadow-gold/30'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }
            `}
          >
            5セグメント分析
          </button>
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${activeTab === 'behavioral'
                ? 'aria-gold-surface shadow-lg shadow-gold/30'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }
            `}
          >
            行動経済学
          </button>
        </div>

        {/* コンテンツ */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            {/* 比較表 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gold/30">
                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">比較項目</th>
                    <th className="text-center p-4 text-gray-700 dark:text-gray-300">従来の方法</th>
                    <th className="text-center p-4 text-gray-700 dark:text-gray-300">AI開発ツール</th>
                    <th className="text-center p-4 aria-gold-surface text-gray-900 dark:text-white font-bold">
                      DevCatalyst
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison['従来の方法'].approach.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-slate-700">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{item.label}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600 dark:text-gray-400">{comparison['従来の方法'].approach[index].value}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {comparison['AI開発ツール'].approach[index].negative ? (
                            <XCircle className="w-4 h-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-gray-600 dark:text-gray-400">{comparison['AI開発ツール'].approach[index].value}</span>
                        </div>
                      </td>
                  <td className="p-4 text-center aria-gold-surface">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{comparison.DevCatalyst.approach[index].value}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 心理的アプローチの違い */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {Object.entries(comparison).map(([key, value]) => (
                <Card key={key} className={`${key === 'DevCatalyst' ? 'border-2 border-gold shadow-xl' : 'border-gray-200 dark:border-slate-700'}`}>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{key}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">心理的アプローチ:</span><br />
                      {value.psychology}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === '5segs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {fiveSegs.map((seg) => {
              const Icon = seg.icon;
              return (
                <Card key={seg.segment} className="border-gold/30 hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full gold-soft-gradient flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-aria-dark-soft" />
                    </div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{seg.segment}</h4>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">従来</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{seg.traditional}</p>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 gold-soft-text mx-auto" />
                      
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">DevCatalyst</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{seg.devCatalyst}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'behavioral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {behavioralEconomics.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.principle} className="border-gold/30 hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full gold-soft-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/30">
                      <Icon className="w-7 h-7 text-aria-dark-soft" />
                    </div>
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 dark:text-white">{item.principle}</h4>
                        <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">行動経済学</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">❌ 問題</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{item.problem}</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">✅ DevCatalystの解決策</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{item.solution}</p>
                      </div>

                      <div className="p-4 aria-gold-surface rounded-lg border-l-4 border-gold/35">
                        <p className="text-xs font-semibold gold-soft-text mb-2">📊 効果</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{item.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 底部CTA */}
        <div className="mt-16 text-center p-8 aria-gold-surface rounded-2xl border-2 border-gold/35">
          <Brain className="w-16 h-16 gold-soft-text mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            科学的アプローチで、成功率78%を実現
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            行動経済学と戦略フレームワークに基づいた、データドリブンな意思決定を。
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>14日間無料トライアル</span>
            <span>•</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>クレジットカード不要</span>
          </div>
        </div>
      </div>
    </section>
  );
}

