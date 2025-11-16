import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Target,
  Users,
  TrendingUp,
  MapPin,
  DollarSign,
  Smartphone,
  Laptop,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
} from 'lucide-react';

export function TargetAnalysis() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const marketSegments = [
    {
      id: 'tech-entrepreneurs',
      name: 'テック起業家',
      size: '2.3M人',
      growth: '+15%',
      accessibility: 85,
      profitability: 90,
      competition: 70,
      description: '技術系スタートアップを運営する起業家',
      demographics: {
        age: '25-45歳',
        income: '500万円-2000万円',
        location: '東京、大阪、福岡',
        devices: ['Laptop', 'Smartphone', 'Tablet'],
      },
      painPoints: ['技術選定の悩み', '市場検証の困難さ', 'リソース不足', '競合分析の手間'],
      channels: ['LinkedIn', 'Twitter', '技術系イベント', 'オンラインコミュニティ'],
    },
    {
      id: 'freelancers',
      name: 'フリーランサー',
      size: '4.1M人',
      growth: '+22%',
      accessibility: 75,
      profitability: 60,
      competition: 85,
      description: '独立して働くクリエイター・エンジニア',
      demographics: {
        age: '22-40歳',
        income: '300万円-800万円',
        location: '全国（リモート中心）',
        devices: ['Laptop', 'Smartphone'],
      },
      painPoints: [
        '案件獲得の困難さ',
        '価格設定の悩み',
        'クライアント管理',
        'スキルアップの時間不足',
      ],
      channels: ['クラウドソーシング', 'SNS', 'コワーキングスペース', 'オンラインセミナー'],
    },
    {
      id: 'small-business',
      name: '中小企業経営者',
      size: '1.8M人',
      growth: '+8%',
      accessibility: 60,
      profitability: 95,
      competition: 50,
      description: '従業員10-50名の中小企業を経営',
      demographics: {
        age: '35-60歳',
        income: '800万円-3000万円',
        location: '全国の主要都市',
        devices: ['Laptop', 'Smartphone'],
      },
      painPoints: ['デジタル化の遅れ', '人材確保の困難', '業務効率化の課題', '新規顧客獲得'],
      channels: ['業界誌', '商工会議所', '展示会', '紹介・口コミ'],
    },
  ];

  const targetingStrategies = [
    {
      segment: 'tech-entrepreneurs',
      strategy: 'テクノロジー特化戦略',
      approach: '最新のAI技術を活用した高度な分析機能をアピール',
      messaging: '「AIがあなたの技術的判断をサポート」',
      timeline: '3ヶ月',
      budget: '200万円',
    },
    {
      segment: 'freelancers',
      strategy: 'コスト効率戦略',
      approach: '手頃な価格で高品質なサービスを提供',
      messaging: '「フリーランスの成功を加速する相棒」',
      timeline: '6ヶ月',
      budget: '100万円',
    },
    {
      segment: 'small-business',
      strategy: '実用性重視戦略',
      approach: 'immediate ROIと使いやすさを重視',
      messaging: '「すぐに使える実践的なビジネス戦略」',
      timeline: '9ヶ月',
      budget: '300万円',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">ターゲット市場分析</h2>
        <p className="text-muted-foreground">
          AIが市場セグメントを分析し、最適なターゲット顧客を特定します
        </p>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="segments">市場セグメント</TabsTrigger>
          <TabsTrigger value="analysis">詳細分析</TabsTrigger>
          <TabsTrigger value="strategy">ターゲティング戦略</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketSegments.map((segment) => (
              <Card
                key={segment.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSegment === segment.id ? 'border-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedSegment(segment.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>{segment.name}</span>
                    </CardTitle>
                    <Badge variant="outline">{segment.growth}</Badge>
                  </div>
                  <CardDescription>{segment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{segment.size}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{segment.growth}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">アクセス性</span>
                      <span className={`text-sm ${getScoreColor(segment.accessibility)}`}>
                        {segment.accessibility}%
                      </span>
                    </div>
                    <Progress value={segment.accessibility} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">収益性</span>
                      <span className={`text-sm ${getScoreColor(segment.profitability)}`}>
                        {segment.profitability}%
                      </span>
                    </div>
                    <Progress value={segment.profitability} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">競合度</span>
                      <span className={`text-sm ${getScoreColor(100 - segment.competition)}`}>
                        {segment.competition}%
                      </span>
                    </div>
                    <Progress value={segment.competition} className="h-2" />
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant={selectedSegment === segment.id ? 'default' : 'outline'}
                  >
                    詳細分析
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedSegment && (
            <Card>
              <CardHeader>
                <CardTitle>
                  選択されたセグメント: {marketSegments.find((s) => s.id === selectedSegment)?.name}
                </CardTitle>
                <CardDescription>このセグメントの詳細な分析結果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">デモグラフィック情報</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>年齢層:</span>
                        <span>
                          {marketSegments.find((s) => s.id === selectedSegment)?.demographics.age}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>年収:</span>
                        <span>
                          {
                            marketSegments.find((s) => s.id === selectedSegment)?.demographics
                              .income
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>地域:</span>
                        <span>
                          {
                            marketSegments.find((s) => s.id === selectedSegment)?.demographics
                              .location
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">主要な課題・ニーズ</h4>
                    <ul className="space-y-2 text-sm">
                      {marketSegments
                        .find((s) => s.id === selectedSegment)
                        ?.painPoints.map((point, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span>{point}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>地理的分布</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>東京都</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>大阪府</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={20} className="w-20 h-2" />
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>愛知県</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={12} className="w-20 h-2" />
                      <span className="text-sm">12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>その他</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={23} className="w-20 h-2" />
                      <span className="text-sm">23%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>デバイス利用状況</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Laptop className="w-4 h-4" />
                      <span>PC/ラップトップ</span>
                    </div>
                    <Badge>92%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>スマートフォン</span>
                    </div>
                    <Badge>89%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>タブレット</span>
                    </div>
                    <Badge variant="outline">34%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>購買行動分析</CardTitle>
              <CardDescription>ターゲット顧客の意思決定プロセスと購買パターン</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-1">認知</h4>
                  <p className="text-xs text-muted-foreground">SNS・口コミ経由が75%</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-medium mb-1">関心</h4>
                  <p className="text-xs text-muted-foreground">無料トライアル利用率85%</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h4 className="font-medium mb-1">検討</h4>
                  <p className="text-xs text-muted-foreground">平均検討期間2-4週間</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="font-medium mb-1">購入</h4>
                  <p className="text-xs text-muted-foreground">月額課金モデル好み</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <div className="space-y-6">
            {targetingStrategies.map((strategy, index) => {
              const segment = marketSegments.find((s) => s.id === strategy.segment);
              return (
                <Card key={strategy.segment}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {segment?.name} - {strategy.strategy}
                      </span>
                      <Badge variant="outline">{strategy.timeline}</Badge>
                    </CardTitle>
                    <CardDescription>{strategy.approach}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">メッセージング</h4>
                        <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                          {strategy.messaging}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">マーケティングチャネル</h4>
                        <ul className="space-y-1 text-sm">
                          {segment?.channels.map((channel, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>{channel}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">予算・リソース</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>予算: {strategy.budget}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>期間: {strategy.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full md:w-auto">
                        この戦略を実行
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
