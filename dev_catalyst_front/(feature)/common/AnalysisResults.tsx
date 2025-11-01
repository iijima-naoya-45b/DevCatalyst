import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Lightbulb,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface AnalysisData {
  strengths: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  marketInsights: {
    size: string;
    growth: string;
    competition: string;
  };
  nextSteps: string[];
  vertexMessage?: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onClose: () => void;
}

export function AnalysisResults({ data, onClose }: AnalysisResultsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gold/25 bg-navy-dark/95 backdrop-blur-md">
        <CardHeader className="border-b border-gold/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif text-gold flex items-center">
              <BarChart3 className="w-6 h-6 mr-3" />
              戦略分析結果
            </CardTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Vertexからのメッセージ */}
          {data.vertexMessage && (
            <div className="bg-gradient-to-r from-gold/10 to-bronze/10 border border-gold/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-bronze rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-navy-deepest font-bold text-sm">V</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gold mb-2">Vertexからの分析コメント</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{data.vertexMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* 市場インサイト */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gold/5 border-gold/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PieChart className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold text-gold mb-2">市場規模</h3>
                <p className="text-sm text-muted-foreground">{data.marketInsights.size}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-green-400 mb-2">成長性</h3>
                <p className="text-sm text-muted-foreground">{data.marketInsights.growth}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-semibold text-orange-400 mb-2">競合状況</h3>
                <p className="text-sm text-muted-foreground">{data.marketInsights.competition}</p>
              </CardContent>
            </Card>
          </div>

          {/* 強み・機会・リスク */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gold/5 border-gold/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-gold">
                  <Target className="w-5 h-5 mr-2" />
                  あなたの強み
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{strength}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-green-400">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  チャンス
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{opportunity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-orange-400">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  注意点
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.risks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{risk}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 推奨アクション */}
          <Card className="bg-bronze/5 border-bronze/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-bronze">
                <BarChart3 className="w-5 h-5 mr-2" />
                推奨アクション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-bronze/10 rounded-lg">
                    <Badge className="bg-bronze text-navy-deepest text-xs">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 次のステップ */}
          <Card className="bg-copper/5 border-copper/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-copper">
                <TrendingUp className="w-5 h-5 mr-2" />
                次のステップ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-copper/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-copper font-semibold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
