import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SocialProof, Authority, FreshStart } from "./BehavioralUX";
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Calendar, 
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Sparkles,
  Brain,
  MessageSquare,
  Eye,
  Clock,
  Star,
  Crown,
  AlertTriangle,
  CheckCircle,
  Timer,
  PlayCircle
} from "lucide-react";

interface DashboardProps {
  onViewChange: (view: string) => void;
  isFirstLogin?: boolean;
}

export function Dashboard({ onViewChange, isFirstLogin = false }: DashboardProps) {
  const currentProjects = [
    {
      id: 1,
      name: "SaaS プロダクト開発",
      progress: 65,
      status: "進行中",
      nextAction: "ターゲット分析完了",
      deadline: "2024年12月末"
    },
    {
      id: 2,
      name: "コンサルティング事業",
      progress: 30,
      status: "計画中",
      nextAction: "市場調査開始",
      deadline: "2025年2月"
    }
  ];

  const insights = [
    {
      title: "市場機会",
      description: "AIツール市場で300%の成長機会を発見",
      type: "opportunity",
      action: "詳細分析"
    },
    {
      title: "競合分析",
      description: "3つの主要競合の弱点を特定",
      type: "competitive",
      action: "戦略策定"
    },
    {
      title: "リソース最適化",
      description: "開発リソースの20%効率化が可能",
      type: "optimization",
      action: "実行計画"
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome & AI Chat Prompt for First Login */}
      {isFirstLogin && (
        <div className="mb-8">
          <Card className="border-2 border-gold bg-gradient-to-r from-gold/10 via-transparent to-bronze/10 backdrop-blur-md shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-bronze rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-8 h-8 text-navy-deepest" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-gold mb-2">
                    アリアがお待ちしています！
                  </h3>
                  <p className="text-muted-foreground">
                    あなた専用のAI戦略パートナーとの初回セッションを始めましょう
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => onViewChange('advisor')}
                  className="h-14 bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-xl"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  アリアと対話を始める
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
                <Button 
                  variant="outline"
                  className="h-14 border-gold/40 text-gold hover:bg-gold/10"
                >
                  <PlayCircle className="w-5 h-5 mr-3" />
                  デモを見る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick AI Access Bar */}
      <div className="mb-8">
        <Card className="border border-bronze/20 bg-bronze/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-bronze rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-navy-deepest" />
                </div>
                <div>
                  <h4 className="font-semibold text-bronze">AIパートナー「アリア」</h4>
                  <p className="text-sm text-muted-foreground">いつでも戦略相談できます</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => onViewChange('advisor')}
                  className="bg-gradient-to-r from-bronze to-copper text-navy-deepest hover:from-bronze-light hover:to-copper-light"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  対話開始
                </Button>
                <Button 
                  variant="outline"
                  className="border-bronze/30 text-bronze hover:bg-bronze/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  過去のセッション
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section with Behavioral UX */}
      <div className="mb-8 md:mb-10">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-navy-dark via-navy to-navy-medium border border-gold/20 p-6 md:p-10 text-foreground shadow-2xl">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-copper/5" />
          <div className="absolute top-6 left-6 w-40 h-40 bg-gold/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-6 right-6 w-32 h-32 bg-bronze/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
          
          <div className="relative z-10">
            {/* Social Proof Inline */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-gold to-bronze rounded-full border-2 border-navy flex items-center justify-center">
                      <Users className="w-4 h-4 text-navy-deepest" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-gold font-semibold">2,847+ 経営者</span>
                  <span className="text-muted-foreground ml-2">が戦略を最適化</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">リアルタイム分析中</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-4xl mb-4 md:mb-6 font-serif font-semibold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent leading-tight">
              データの迷路から、確信の道筋へ
            </h2>
            
            <p className="text-muted-foreground mb-6 md:mb-8 max-w-3xl text-base md:text-lg leading-relaxed font-light">
              <strong className="text-gold">78%の経営者</strong>が「戦略の孤独」を感じています。
              アリアとの対話で、あなたの直感をデータで裏付けし、競合に差をつける戦略インサイトを発見しましょう。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Button 
                onClick={() => onViewChange('advisor')}
                className="bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-xl shadow-gold/25 px-6 md:px-8 py-3 text-sm md:text-base group transition-all duration-300 w-full sm:w-auto"
              >
                <Brain className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 group-hover:pulse transition-transform" />
                今すぐアリアと戦略セッション
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
        <Card className="border border-gold/25 shadow-2xl bg-gradient-to-br from-navy-dark/80 to-navy-medium/60 backdrop-blur-md relative overflow-hidden group hover:shadow-gold/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">アクティブプロジェクト</CardTitle>
              <div className="p-2 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors duration-300">
                <TrendingUp className="w-4 h-4 text-gold" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl mb-2 text-gold font-bold tracking-tight">2</div>
            <p className="text-xs text-gold/60 font-medium">+1 前月比</p>
          </CardContent>
        </Card>

        <Card className="border border-gold/25 shadow-2xl bg-gradient-to-br from-navy-dark/80 to-navy-medium/60 backdrop-blur-md relative overflow-hidden group hover:shadow-gold/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-bronze/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">AI分析完了</CardTitle>
              <div className="p-2 rounded-lg bg-bronze/10 group-hover:bg-bronze/20 transition-colors duration-300">
                <Zap className="w-4 h-4 text-bronze" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl mb-2 text-bronze font-bold tracking-tight">7</div>
            <p className="text-xs text-bronze/60 font-medium">今月の実行数</p>
          </CardContent>
        </Card>

        <Card className="border border-gold/25 shadow-2xl bg-gradient-to-br from-navy-dark/80 to-navy-medium/60 backdrop-blur-md relative overflow-hidden group hover:shadow-gold/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">ターゲット市場</CardTitle>
              <div className="p-2 rounded-lg bg-copper/10 group-hover:bg-copper/20 transition-colors duration-300">
                <Users className="w-4 h-4 text-copper" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl mb-2 text-copper font-bold tracking-tight">3</div>
            <p className="text-xs text-copper/60 font-medium">セグメント特定済み</p>
          </CardContent>
        </Card>

        <Card className="border border-gold/25 shadow-2xl bg-gradient-to-br from-navy-dark/80 to-navy-medium/60 backdrop-blur-md relative overflow-hidden group hover:shadow-gold/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">成功確率</CardTitle>
              <div className="p-2 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors duration-300">
                <BarChart3 className="w-4 h-4 text-gold" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl mb-2 text-gold font-bold tracking-tight">78%</div>
            <p className="text-xs text-gold/60 font-medium">AI予測スコア</p>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral UX Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        <SocialProof 
          userCount={2847}
          recentActions={[
            "田中さんが競合分析を完了",
            "佐藤さんが新戦略を策定",
            "山田さんがマーケット参入を決定"
          ]}
        />
        
        <FreshStart
          opportunity="AI戦略分析で競合に差をつける"
          timeframe="48時間"
          onStart={() => onViewChange('advisor')}
        />
        
        <Authority
          expertName="戦略コンサルタント 鈴木氏"
          credentials={["Harvard MBA", "McKinsey出身", "上場3社の戦略責任者"]}
          recommendation="アリアの分析精度は、人間のコンサルタントに匹敵します。特に初期戦略の方向性確認には最適です。"
        />
      </div>

      {/* Insight-Driven Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Strategic Insights */}
        <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-lg md:text-xl">
              <div className="p-2 rounded-lg bg-gold/15">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-gold" />
              </div>
              <span className="font-serif font-semibold">戦略インサイト</span>
            </CardTitle>
            <CardDescription className="text-sm md:text-base leading-relaxed">
              アリアが発見したあなたのビジネスの重要な洞察
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Insights with CTA */}
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-gold/10 to-bronze/10 border border-gold/20 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-navy-deepest" />
                  </div>
                  <span className="font-semibold text-gold">新機会発見</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  あなたの業界で未開拓の市場セグメントを3つ特定しました。
                  競合が見落としている領域への参入チャンスです。
                </p>
                <Button 
                  onClick={() => onViewChange('advisor')}
                  size="sm" 
                  className="bg-gold text-navy-deepest hover:bg-gold-light"
                >
                  詳細をアリアに聞く
                  <MessageSquare className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="p-6 bg-gradient-to-r from-orange-400/10 to-red-400/10 border border-orange-400/20 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-orange-400">リスク警告</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  現在の戦略には2つの潜在的リスクがあります。
                  早期対策で競争優位を維持できます。
                </p>
                <Button 
                  onClick={() => onViewChange('advisor')}
                  size="sm" 
                  variant="outline"
                  className="border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
                >
                  対策を相談する
                  <Brain className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-400/10 border border-green-400/20 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-green-400">成長機会</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  現在のトレンドを活用すれば、6ヶ月で売上30%向上が見込めます。
                  実行プランを一緒に立てましょう。
                </p>
                <Button 
                  onClick={() => onViewChange('advisor')}
                  size="sm" 
                  className="bg-green-400 text-white hover:bg-green-500"
                >
                  プランを作成
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => onViewChange('advisor')}
                variant="outline" 
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                すべてのインサイトを見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 rounded-lg bg-gold/15">
                <Lightbulb className="w-6 h-6 text-gold" />
              </div>
              <span className="font-serif font-semibold">AI戦略インサイト</span>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              最新のAI分析結果と推奨アクション
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="border border-gold/20 rounded-xl p-6 space-y-4 bg-navy-medium/50 backdrop-blur-sm hover:bg-navy-medium/70 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{insight.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                  <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5 px-3 py-1">{insight.type}</Badge>
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-gold/20 to-bronze/20 hover:from-gold/30 hover:to-bronze/30 border border-gold/30 text-gold" variant="outline">
                  {insight.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}