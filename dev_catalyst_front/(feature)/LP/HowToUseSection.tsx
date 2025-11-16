'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Brain, Sparkles, Rocket, User, Code, Palette, Briefcase, FileText, Lightbulb, Target, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '../common/ui/card';
import { Badge } from '../common/ui/badge';
import { useInView } from '../../hooks/use-in-view';

// ビジュアライゼーション
const ProductEvolution = dynamic(() => import('../../components/ui/visualizations/ProductEvolution').then(mod => ({ default: mod.ProductEvolution })), {
  ssr: false,
});

const personas = [
  {
    id: 'entrepreneur',
    icon: User,
    label: '起業家',
    name: '田中さん (32)',
    role: 'SaaS起業を目指す',
    problem: '技術がわからず、何から始めれば良いかわからない...',
    ariaDialogue: [
      { role: 'user', text: '飲食店向けの予約管理システムを作りたいんですが、何から始めれば...' },
      { role: 'aria', text: 'まず市場を見てみましょう。既存の予約システムは月額1-3万円が相場ですね。差別化ポイントは「小規模店舗向けの低価格」と「LINE連携」が有効です。' },
      { role: 'user', text: 'なるほど。技術的にはどう作れば？' },
      { role: 'aria', text: 'Next.js + Supabaseで構築すれば、月額コストは¥2,000以下。LINEミニアプリとの連携も可能です。まずは予約機能とカレンダー表示から始めましょう。' },
    ],
    vision: {
      title: '目指すSaaSプロジェクト',
      description: '小規模飲食店向け予約管理SaaS「ReservePro」',
      features: [
        'LINE予約受付（顧客の使い慣れたツール）',
        '月額¥2,980の低価格（既存の1/3）',
        '即日導入可能（設定5分）',
        '予約分析ダッシュボード',
      ],
      metrics: {
        target: '個人経営の飲食店 3,000店舗',
        revenue: '月間 ¥8,940,000（MRR）',
        timeline: '3ヶ月でβ版、6ヶ月で100店舗',
      },
    },
    result: {
      period: '3ヶ月',
      achievement: 'β版リリース、15店舗導入',
    },
  },
  {
    id: 'engineer',
    icon: Code,
    label: 'エンジニア',
    name: '佐藤さん (28)',
    role: '副業でサービス開発',
    problem: '本業が忙しく、企画や戦略を考える時間がない...',
    ariaDialogue: [
      { role: 'user', text: '週末だけでSaaSを作りたいです。エンジニア向けのドキュメント管理ツールを考えています。' },
      { role: 'aria', text: 'Notion、Confluenceとの差別化が重要です。エンジニア向けなら「コードスニペット管理」「API自動ドキュメント生成」が有効です。' },
      { role: 'user', text: '技術スタックは？' },
      { role: 'aria', text: 'Next.js + MDX + Prisma + PostgreSQLがおすすめです。週末開発なら、まずMarkdownエディタとバージョン管理から。GitHubログインで即使えるようにしましょう。' },
    ],
    vision: {
      title: '目指すSaaSプロジェクト',
      description: 'エンジニア向けドキュメント管理「DevDocs」',
      features: [
        'コードスニペット自動整形',
        'GitHub連携で自動ドキュメント生成',
        'チーム共有とバージョン管理',
        'APIドキュメント自動生成',
      ],
      metrics: {
        target: '開発チーム 500社',
        revenue: '月間 ¥2,500,000（¥5,000/チーム）',
        timeline: '6週間でMVP、3ヶ月で50チーム',
      },
    },
    result: {
      period: '6週間',
      achievement: 'MVP完成、20チームが利用開始',
    },
  },
  {
    id: 'designer',
    icon: Palette,
    label: 'デザイナー',
    name: '山田さん (26)',
    role: 'UIデザイナー→プロダクトオーナーへ',
    problem: 'デザインはできるけど、ビジネス戦略が苦手...',
    ariaDialogue: [
      { role: 'user', text: 'デザイナー向けのアセット管理ツールを作りたいです。でもビジネスモデルが...' },
      { role: 'aria', text: 'デザイナーの課題は「アセットの散在」と「バージョン管理」ですね。サブスクモデルで、個人¥980、チーム¥4,980が適正価格です。' },
      { role: 'user', text: 'どんな機能が必要ですか？' },
      { role: 'aria', text: 'クラウドストレージ、AIタグ付け、Figma/Adobe連携、そしてデザインシステム管理。最初はクラウドストレージ+タグ検索から始めましょう。' },
    ],
    vision: {
      title: '目指すSaaSプロジェクト',
      description: 'デザインアセット管理「AssetFlow」',
      features: [
        'AIによる自動タグ付けと検索',
        'Figma/Adobe XD連携',
        'デザインシステム管理',
        'チームでのアセット共有',
      ],
      metrics: {
        target: 'デザイナー・デザインチーム 2,000ユーザー',
        revenue: '月間 ¥1,960,000（個人+チーム）',
        timeline: '2ヶ月でMVP、4ヶ月で300ユーザー',
      },
    },
    result: {
      period: '2ヶ月',
      achievement: 'MVP完成、100ユーザー獲得',
    },
  },
  {
    id: 'sales',
    icon: Briefcase,
    label: '営業パーソン',
    name: '鈴木さん (35)',
    role: 'BtoB営業マネージャー',
    problem: '顧客への提案資料作成に時間がかかり、競合分析も手作業で大変...',
    ariaDialogue: [
      { role: 'user', text: '製造業のお客様に、在庫管理システムの提案をしたいです。競合他社の分析と、お客様の課題に合わせた提案内容を考えてほしいです。' },
      { role: 'aria', text: '製造業の在庫管理システム市場を分析しました。主要競合はA社（月額¥50,000）、B社（月額¥80,000）です。差別化ポイントは「中小製造業向けの低価格」と「既存ERP連携」が有効です。' },
      { role: 'user', text: 'お客様は「在庫の見える化」と「発注の自動化」を課題にしています。提案書の構成を考えてください。' },
      { role: 'aria', text: '提案書の構成案：1. 現状課題の整理（在庫の見える化不足、手動発注の非効率）、2. 解決策（リアルタイム在庫ダッシュボード、AI発注予測）、3. 導入効果（作業時間30%削減、在庫コスト15%削減）、4. 導入スケジュール。Spec生成機能で詳細な提案書を作成できます。' },
    ],
    vision: {
      title: '営業活動の効率化',
      description: 'AI支援による提案資料自動生成',
      features: [
        '顧客課題に基づく競合分析の自動化',
        '提案書・見積書の自動生成（Spec生成機能）',
        '顧客ニーズ分析と最適ソリューション提案',
        '営業資料の標準化と品質向上',
      ],
      metrics: {
        target: '営業チーム 10名',
        revenue: '提案資料作成時間 70%削減',
        timeline: '1週間で導入、2週間で全員が活用',
      },
    },
    result: {
      period: '2週間',
      achievement: '提案資料作成時間を3時間→50分に短縮、成約率15%向上',
    },
  },
];

export function HowToUseSection() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.2 });
  const { ref: evolutionRef, isInView: evolutionInView } = useInView({ threshold: 0.2 });
  const { ref: personaRef, isInView: personaInView } = useInView({ threshold: 0.2 });
  const { ref: specRef, isInView: specInView } = useInView({ threshold: 0.2 });
  const { ref: differenceRef, isInView: differenceInView } = useInView({ threshold: 0.2 });

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* セクションヘッダー */}
        <div ref={headerRef} className={`text-center mb-12 sm:mb-16 fade-in-up ${headerInView ? 'in-view' : ''}`}>
          <Badge className="bg-gold/10 gold-soft-text border-gold/30 mb-4">
            HOW TO USE
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
            どのように使えば良いの？
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            あなたのアイデアが、Ariaとの対話を通じて、具体的な形になっていきます。
            <br />
            <span className="gold-soft-text font-semibold">行動経済学・心理学・マーケティングの視点</span>から、あなたの心理体験に基づいて提案します。
          </p>
        </div>

        {/* プロダクト進化ビジュアライゼーション */}
        <div ref={evolutionRef} className="mb-12 sm:mb-16 md:mb-20">
          <div className={`text-center mb-8 sm:mb-12 fade-in-up ${evolutionInView ? 'in-view' : ''}`}>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              アイデアから、プロダクトへ
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Ariaとの対話を通じて、曖昧だったアイデアが、<br />
              具体的なプロダクトへと進化していきます。
            </p>
          </div>
          
          <ProductEvolution />

          {/* 中央メッセージ */}
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
              あなたのプロダクトが、<span className="gold-soft-text">形になる</span>
            </p>
          </div>
        </div>

        {/* GPTとの違いを強調 */}
        <div ref={differenceRef} className={`mb-16 sm:mb-20 fade-in-up ${differenceInView ? 'in-view' : ''}`}>
          <Card className="border-2 border-gold/40 bg-gradient-to-br from-gold/5 to-gold/10 dark:from-gold/10 dark:to-gold/5">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 mb-4">
                  <Zap className="w-5 h-5 gold-soft-text" />
                  <span className="text-sm font-semibold gold-soft-text">GPTとは違う体験</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  単なる情報提供ではなく、
                  <br />
                  <span className="gold-soft-text">あなたの心理体験に基づいた提案</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                  GPTに相談するのとは根本的に異なる体験。
                  <span className="gold-soft-text font-semibold">RAG技術による戦略特化</span>により、
                  Ariaは行動経済学・心理学・マーケティングの専門知識ベースから最適な情報を取得し、
                  <br />
                  あなたの感情や迷い、心理的な障壁まで理解した上で、戦略を提案します。
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
                <div className="text-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                  <Lightbulb className="w-8 h-8 gold-soft-text mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">行動経済学の視点</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    損失回避、アンカリング効果など、人間の意思決定の心理を理解した提案
                  </p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                  <Target className="w-8 h-8 gold-soft-text mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">心理学の視点</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    ユーザーの心理状態や感情を考慮し、共感に基づいた戦略を構築
                  </p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                  <TrendingUp className="w-8 h-8 gold-soft-text mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">マーケティングの視点</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    市場の本質を理解し、顧客の心理に響く差別化戦略を提案
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spec生成機能の強調 */}
        <div ref={specRef} className={`mb-16 sm:mb-20 fade-in-up ${specInView ? 'in-view' : ''}`}>
          <Card className="border-2 border-gold/40 bg-white dark:bg-slate-800 shadow-xl">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg gold-soft-gradient flex items-center justify-center">
                  <FileText className="w-6 h-6 text-aria-dark-soft" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white">
                    Spec生成機能
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    対話から自動生成される詳細な仕様書
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ariaとの対話を通じて、あなたのアイデアや戦略を整理した後、
                  <span className="gold-soft-text font-semibold">「Spec生成」ボタン一つで詳細な仕様書を自動生成</span>できます。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-start gap-2 p-3 bg-gold/5 dark:bg-gold/10 rounded-lg">
                    <Sparkles className="w-4 h-4 gold-soft-text flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      対話内容から自動で構造化された仕様書を作成
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-gold/5 dark:bg-gold/10 rounded-lg">
                    <Sparkles className="w-4 h-4 gold-soft-text flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      セクションごとに編集・保存・削除が可能
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-gold/5 dark:bg-gold/10 rounded-lg">
                    <Sparkles className="w-4 h-4 gold-soft-text flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Markdown・PDF・Notionへのエクスポート対応
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-gold/5 dark:bg-gold/10 rounded-lg">
                    <Sparkles className="w-4 h-4 gold-soft-text flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      営業提案書、プロジェクト仕様書など様々な用途に対応
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ペルソナ別のストーリー - Ariaとの対話とビジョン */}
        <div ref={personaRef}>
          <h3 className={`text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white fade-in-up ${personaInView ? 'in-view' : ''}`}>
            あなたと同じ立場の人が、どう使っているか
          </h3>

          {/* ペルソナタブ */}
          <div className={`flex justify-center gap-3 sm:gap-4 mb-8 flex-wrap fade-in-up ${personaInView ? 'in-view delay-200' : ''}`}>
            {personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`
                    flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base
                    ${selectedPersona.id === persona.id
                      ? 'aria-gold-surface shadow-[0_18px_35px_-20px_rgba(15,23,42,0.45)] scale-105'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gold/25 hover:border-gold/40'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedPersona.id === persona.id ? 'text-aria-dark-soft' : 'gold-soft-text'}`} />
                  {persona.label}
                </button>
              );
            })}
          </div>

          {/* ペルソナストーリー */}
          <Card className={`max-w-5xl mx-auto border-gold/30 bg-white dark:bg-slate-800 shadow-xl scale-in ${personaInView ? 'in-view delay-300' : ''}`}>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                {/* ペルソナ情報 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gold-soft-gradient flex items-center justify-center flex-shrink-0 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)]">
                    {(() => {
                      const Icon = selectedPersona.icon;
                      return <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-aria-dark-soft" />;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{selectedPersona.name}</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{selectedPersona.role}</p>
                  </div>
                </div>

                {/* 課題 */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-red-400">
                  <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 mb-1">課題</p>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{selectedPersona.problem}</p>
                </div>

                {/* Ariaとの対話 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 gold-soft-text" />
                    <p className="font-semibold text-gray-900 dark:text-white">Ariaとの対話</p>
                    <Badge variant="outline" className="ml-auto border-gold/30 gold-soft-text text-xs">
                      心理体験に基づく提案
                    </Badge>
                  </div>
                  {selectedPersona.ariaDialogue.map((dialogue, index) => (
                    <div
                      key={index}
                      className={`
                        flex gap-3 ${dialogue.role === 'aria' ? 'justify-start' : 'justify-end'}
                      `}
                    >
                      <div
                        className={`
                          max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl
                          ${dialogue.role === 'aria'
                            ? 'aria-gold-surface border border-gold/35 text-aria-dark-soft'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200'
                          }
                        `}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed">{dialogue.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 目指すSaaSビジョン */}
                <div className="p-4 sm:p-6 aria-gold-surface rounded-xl border-2 border-gold/35">
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 gold-soft-text" />
                    <h5 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{selectedPersona.vision.title}</h5>
                  </div>
                  
                  <p className="text-xl sm:text-2xl font-bold gold-soft-text mb-4 sm:mb-6">{selectedPersona.vision.description}</p>

                  {/* 主要機能 */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">主要機能</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPersona.vision.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 gold-soft-text flex-shrink-0" />
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 目標数値 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ターゲット</p>
                      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">{selectedPersona.vision.metrics.target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">目標売上</p>
                      <p className="font-semibold text-xs sm:text-sm gold-soft-text">{selectedPersona.vision.metrics.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">スケジュール</p>
                      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">{selectedPersona.vision.metrics.timeline}</p>
                    </div>
                  </div>
                </div>

                {/* 実績 */}
                <div className="p-4 aria-gold-surface rounded-lg border-l-4 border-gold/35">
                  <p className="text-xs sm:text-sm font-semibold gold-soft-text mb-2">実績</p>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">期間</p>
                      <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{selectedPersona.result.period}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">達成</p>
                      <p className="font-bold text-sm sm:text-base gold-soft-text">{selectedPersona.result.achievement}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

