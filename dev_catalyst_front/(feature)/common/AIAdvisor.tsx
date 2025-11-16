import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { AriaChat } from './AriaChat';
import {
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Brain,
} from 'lucide-react';

export function AIAdvisor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAriaChat, setShowAriaChat] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    idea: '',
    currentStage: '',
    resources: '',
    timeline: '',
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const analysisResults = {
    score: 85,
    strengths: ['市場の成長性が高い', '競合優位性がある', '実現可能性が高い'],
    risks: ['初期投資が大きい', '市場教育が必要', '技術的難易度が高い'],
    recommendations: [
      {
        priority: '高',
        action: 'MVP（最小実行可能製品）の開発を優先',
        reason: '市場検証を早期に実施するため',
        timeline: '3ヶ月',
      },
      {
        priority: '中',
        action: 'パートナーシップの構築',
        reason: 'リソース不足を補完するため',
        timeline: '6ヶ月',
      },
      {
        priority: '低',
        action: '資金調達の準備',
        reason: 'スケールアップのため',
        timeline: '9ヶ月',
      },
    ],
    nextSteps: ['競合分析の深掘り', 'ターゲット顧客の具体化', '技術要件の詳細設計'],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2">AI戦略アドバイザー</h2>
            <p className="text-muted-foreground">
              アリアとの対話型分析で、あなたのビジネス戦略を深化させましょう
            </p>
          </div>
          <Button
            onClick={() => setShowAriaChat(!showAriaChat)}
            className={`transition-all duration-300 ${showAriaChat ? 'bg-gold text-navy-deepest shadow-lg' : 'bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light hover:shadow-xl'}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {showAriaChat ? 'フォーム分析に戻る' : 'アリアと対話する'}
          </Button>
        </div>
      </div>

      {showAriaChat && (
        <div className="mb-8">
          <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 gold-soft-text" />
                <span>アリアとの戦略セッション</span>
              </CardTitle>
              <CardDescription>対話を通じてより深い戦略インサイトを発見しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <AriaChat />
            </CardContent>
          </Card>
        </div>
      )}

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-bronze" />
                <span>ビジネス情報入力</span>
              </CardTitle>
              <CardDescription>
                AIが適切な分析を行うために必要な情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">ビジネスアイデア・コンセプト</Label>
                <Textarea
                  id="idea"
                  placeholder="あなたのビジネスアイデアを詳しく説明してください..."
                  value={businessInfo.idea}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, idea: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">現在のステージ</Label>
                <Input
                  id="stage"
                  placeholder="アイデア段階、MVP開発中、既にローンチ済みなど"
                  value={businessInfo.currentStage}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, currentStage: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resources">利用可能なリソース</Label>
                <Textarea
                  id="resources"
                  placeholder="資金、時間、人材、技術スキルなど"
                  value={businessInfo.resources}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, resources: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">目標タイムライン</Label>
                <Input
                  id="timeline"
                  placeholder="6ヶ月でローンチ、1年で売上目標達成など"
                  value={businessInfo.timeline}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, timeline: e.target.value })}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !businessInfo.idea}
                className="w-full bg-bronze hover:bg-bronze-light text-navy-dark"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    AI分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI戦略分析を開始
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>効果的な分析のために</CardTitle>
              <CardDescription>より正確な分析結果を得るためのコツ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">具体的に記述</h4>
                    <p className="text-sm text-muted-foreground">
                      「ECサイト」ではなく「中小企業向けのB2B ECプラットフォーム」のように具体的に
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">課題を明確に</h4>
                    <p className="text-sm text-muted-foreground">
                      解決したい問題や提供する価値を明確に記述してください
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">制約条件も記載</h4>
                    <p className="text-sm text-muted-foreground">
                      予算、時間、スキルなどの制約も正直に記載することで現実的な提案が得られます
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-bronze/10 border border-bronze/20 p-4 rounded-lg">
                <h4 className="font-medium text-bronze-light mb-2">AIの分析項目</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 市場機会とサイズ</li>
                  <li>• 競合状況分析</li>
                  <li>• 実現可能性評価</li>
                  <li>• リスク要因特定</li>
                  <li>• 推奨戦略とアクション</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2 border-bronze bg-gradient-to-r from-bronze/10 to-bronze-light/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-bronze" />
                <span>AI分析結果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-bronze-light mb-2">
                    {analysisResults.score}
                  </div>
                  <div className="text-sm text-muted-foreground">成功予測スコア</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2">総合評価</h4>
                  <p className="text-sm text-muted-foreground">
                    あなたのビジネスアイデアは高い成功可能性を持っています。
                    市場のニーズとマッチしており、適切な戦略で実行すれば成功確率が高いと予測されます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-bronze">
                  <CheckCircle className="w-5 h-5" />
                  <span>強み・機会</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResults.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-bronze rounded-full" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Risks */}
            <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>リスク・課題</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResults.risks.map((risk, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-bronze" />
                <span>推奨アクション</span>
              </CardTitle>
              <CardDescription>優先度順に整理された具体的なアクションプラン</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            rec.priority === '高'
                              ? 'destructive'
                              : rec.priority === '中'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          優先度: {rec.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{rec.timeline}</span>
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">{rec.action}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>
                    <Button size="sm" variant="outline">
                      詳細計画を作成
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback & Regeneration */}
          <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 gold-soft-text" />
                <span>フィードバック・追加分析</span>
              </CardTitle>
              <CardDescription>分析結果の改善や追加質問をお聞かせください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-12 bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light"
                  onClick={() => setIsAnalyzing(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  AI分析を再生成
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gold/30 gold-soft-text hover:bg-gold/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  追加質問をする
                </Button>
              </div>

              <div className="space-y-4">
                <Label>改善リクエスト・コメント</Label>
                <Textarea
                  placeholder="この分析についてのフィードバックや、さらに詳しく知りたい点があればお聞かせください..."
                  className="min-h-[100px] bg-input-background border-gold/20 focus:border-gold"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-bronze/30 text-bronze">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    この分析は役立った
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-400/30 text-orange-400"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    改善が必要
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border border-bronze/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>次のステップ</CardTitle>
              <CardDescription>AI分析を活用してさらに戦略を深化させましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResults.nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border border-bronze/20 rounded-lg hover:bg-bronze/5 cursor-pointer transition-all"
                  >
                    <div className="w-8 h-8 bg-bronze/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-bronze font-medium">{index + 1}</span>
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              新しい分析を開始
            </Button>
            <Button className="bg-bronze hover:bg-bronze-light text-navy-dark">
              ターゲット分析に進む
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
