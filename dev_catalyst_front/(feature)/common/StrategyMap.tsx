import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Map, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  Users,
  DollarSign
} from "lucide-react";

export function StrategyMap() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const strategyPhases = [
    {
      id: 1,
      title: "市場参入準備",
      duration: "1-3ヶ月",
      status: "completed",
      progress: 100,
      description: "基盤構築とMVP開発",
      objectives: [
        "MVP開発完了",
        "初期ユーザーテスト実施",
        "フィードバック収集",
        "プロダクトマーケットフィット検証"
      ],
      keyActions: [
        {
          action: "技術基盤構築",
          responsible: "開発チーム",
          status: "completed",
          deadline: "2024年1月末"
        },
        {
          action: "ユーザーインタビュー",
          responsible: "マーケティング",
          status: "completed", 
          deadline: "2024年2月末"
        },
        {
          action: "MVP β版リリース",
          responsible: "プロダクト",
          status: "completed",
          deadline: "2024年3月末"
        }
      ],
      budget: "500万円",
      kpis: [
        { metric: "ユーザー登録数", target: "100人", current: "127人" },
        { metric: "アクティブ率", target: "60%", current: "73%" },
        { metric: "満足度スコア", target: "4.0", current: "4.2" }
      ]
    },
    {
      id: 2,
      title: "早期成長",
      duration: "4-9ヶ月",
      status: "in-progress",
      progress: 65,
      description: "ユーザー獲得とプロダクト改善",
      objectives: [
        "月間1000ユーザー獲得",
        "リテンション率50%達成",
        "主要機能完成",
        "収益化モデル確立"
      ],
      keyActions: [
        {
          action: "マーケティング戦略実行",
          responsible: "マーケティング",
          status: "in-progress",
          deadline: "2024年6月末"
        },
        {
          action: "機能拡張開発",
          responsible: "開発チーム", 
          status: "in-progress",
          deadline: "2024年7月末"
        },
        {
          action: "料金体系設計",
          responsible: "ビジネス",
          status: "pending",
          deadline: "2024年8月末"
        }
      ],
      budget: "800万円",
      kpis: [
        { metric: "月間新規ユーザー", target: "1000人", current: "650人" },
        { metric: "リテンション率", target: "50%", current: "42%" },
        { metric: "月間売上", target: "50万円", current: "28万円" }
      ]
    },
    {
      id: 3,
      title: "スケールアップ",
      duration: "10-18ヶ月",
      status: "planned",
      progress: 0,
      description: "事業拡大と組織強化",
      objectives: [
        "月間10,000ユーザー達成",
        "月間売上500万円突破",
        "チーム拡大（10名）",
        "新市場進出準備"
      ],
      keyActions: [
        {
          action: "大規模マーケティング",
          responsible: "マーケティング",
          status: "planned",
          deadline: "2024年12月末"
        },
        {
          action: "組織拡大・採用",
          responsible: "人事",
          status: "planned",
          deadline: "2025年3月末"
        },
        {
          action: "インフラスケーリング",
          responsible: "開発チーム",
          status: "planned",
          deadline: "2025年6月末"
        }
      ],
      budget: "2000万円",
      kpis: [
        { metric: "月間ユーザー数", target: "10,000人", current: "-" },
        { metric: "月間売上", target: "500万円", current: "-" },
        { metric: "チームサイズ", target: "10人", current: "3人" }
      ]
    },
    {
      id: 4,
      title: "市場リーダーシップ",
      duration: "19-24ヶ月",
      status: "planned",
      progress: 0,
      description: "業界リーダーとしての地位確立",
      objectives: [
        "業界シェア20%獲得",
        "年間売上1億円達成",
        "パートナーシップ拡大",
        "グローバル展開検討"
      ],
      keyActions: [
        {
          action: "戦略的パートナーシップ",
          responsible: "ビジネス開発",
          status: "planned",
          deadline: "2025年9月末"
        },
        {
          action: "エンタープライズ対応",
          responsible: "プロダクト",
          status: "planned",
          deadline: "2025年12月末"
        },
        {
          action: "海外展開準備",
          responsible: "経営陣",
          status: "planned",
          deadline: "2026年3月末"
        }
      ],
      budget: "5000万円",
      kpis: [
        { metric: "市場シェア", target: "20%", current: "-" },
        { metric: "年間売上", target: "1億円", current: "-" },
        { metric: "企業パートナー数", target: "50社", current: "-" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">戦略ロードマップ</h2>
        <p className="text-muted-foreground">
          AI分析に基づいた段階的な事業成長戦略とマイルストーン
        </p>
      </div>

      {/* Timeline Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Map className="w-5 h-5" />
            <span>戦略タイムライン概要</span>
          </CardTitle>
          <CardDescription>
            24ヶ月間の段階的成長計画
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              {strategyPhases.map((phase, index) => (
                <div key={phase.id} className="flex-1 relative">
                  <div 
                    className={`w-4 h-4 rounded-full mx-auto mb-2 cursor-pointer ${
                      phase.status === 'completed' ? 'bg-green-600' :
                      phase.status === 'in-progress' ? 'bg-blue-600' :
                      'bg-gray-300'
                    }`}
                    onClick={() => setSelectedPhase(phase.id)}
                  />
                  {index < strategyPhases.length - 1 && (
                    <div className="absolute top-2 left-1/2 w-full h-0.5 bg-gray-300" />
                  )}
                  <div className="text-center">
                    <p className="text-xs font-medium">{phase.title}</p>
                    <p className="text-xs text-muted-foreground">{phase.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Phases */}
      <div className="space-y-6">
        {strategyPhases.map((phase) => (
          <Card 
            key={phase.id}
            className={`transition-all ${
              selectedPhase === phase.id ? 'border-blue-500 shadow-lg' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    phase.status === 'completed' ? 'bg-green-600' :
                    phase.status === 'in-progress' ? 'bg-blue-600' :
                    'bg-gray-400'
                  }`}>
                    {phase.id}
                  </span>
                  <span>{phase.title}</span>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status === 'completed' ? '完了' :
                     phase.status === 'in-progress' ? '進行中' : '計画中'}
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{phase.duration}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    {selectedPhase === phase.id ? '閉じる' : '詳細'}
                  </Button>
                </div>
              </div>
              <CardDescription>{phase.description}</CardDescription>
              {phase.status === 'in-progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>進捗</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>
              )}
            </CardHeader>

            {selectedPhase === phase.id && (
              <CardContent className="space-y-6">
                {/* Objectives */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>主要目標</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Actions */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>主要アクション</span>
                  </h4>
                  <div className="space-y-3">
                    {phase.keyActions.map((action, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(action.status)}
                            <span className="font-medium">{action.action}</span>
                          </div>
                          <Badge variant="outline">{action.deadline}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          担当: {action.responsible}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPIs */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>主要指標（KPI）</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phase.kpis.map((kpi, index) => (
                      <div key={index} className="border rounded-lg p-3 text-center">
                        <div className="text-sm text-muted-foreground">{kpi.metric}</div>
                        <div className="text-lg font-medium">
                          {kpi.current !== '-' ? kpi.current : '未開始'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          目標: {kpi.target}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">予算</span>
                    </div>
                    <span className="text-lg font-medium">{phase.budget}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4 border-t">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    アクション追加
                  </Button>
                  <Button variant="outline">
                    進捗を更新
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>総期間</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">24ヶ月</div>
            <p className="text-sm text-muted-foreground">市場リーダーまでの道のり</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>総投資額</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">8,300万円</div>
            <p className="text-sm text-muted-foreground">段階的な投資計画</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>目標ユーザー</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">10,000人</div>
            <p className="text-sm text-muted-foreground">月間アクティブユーザー</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}