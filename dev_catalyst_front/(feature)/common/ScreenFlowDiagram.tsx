import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  ArrowDown,
  Home,
  Lightbulb,
  Target,
  Map,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  MousePointer,
  Eye,
  Zap,
  RefreshCw
} from "lucide-react";

interface ScreenFlowDiagramProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onShowFlow: () => void;
}

export function ScreenFlowDiagram({ currentView, onViewChange, onShowFlow }: ScreenFlowDiagramProps) {
  const [selectedFlow, setSelectedFlow] = useState<'basic' | 'recommended' | 'action'>('recommended');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const screens = [
    {
      id: 'dashboard',
      title: 'ダッシュボード',
      subtitle: 'メイン画面',
      icon: Home,
      description: '全体統括ビュー・KPI表示',
      color: 'from-gold to-bronze',
      features: ['統計カード', 'プロジェクト一覧', 'AIインサイト', 'クイックアクション'],
      status: 'active'
    },
    {
      id: 'advisor',
      title: 'AI戦略分析',
      subtitle: 'AI分析エンジン',
      icon: Lightbulb,
      description: 'ビジネスアイデア分析・戦略提案',
      color: 'from-bronze to-copper',
      features: ['アイデア入力', 'AI分析', '成功予測', '推奨アクション'],
      status: 'development'
    },
    {
      id: 'target',
      title: 'ターゲット分析',
      subtitle: '市場分析',
      icon: Target,
      description: '市場規模・競合・顧客セグメント',
      color: 'from-copper to-bronze',
      features: ['市場規模算出', '競合分析', 'ペルソナ作成', 'ポジショニング'],
      status: 'development'
    },
    {
      id: 'strategy',
      title: '戦略マップ',
      subtitle: '戦略ビジュアライゼーション',
      icon: Map,
      description: 'ビジネスモデル・ロードマップ',
      color: 'from-gold to-gold-light',
      features: ['BMキャンバス', 'バリューチェーン', 'ロードマップ', 'アクションプラン'],
      status: 'development'
    },
    {
      id: 'settings',
      title: '設定',
      subtitle: 'システム管理',
      icon: Settings,
      description: 'プロファイル・データ管理',
      color: 'from-silver to-silver-light',
      features: ['プロファイル', '通知設定', 'データ出力', 'アカウント管理'],
      status: 'development'
    }
  ];

  const flows = {
    basic: [
      { from: 'dashboard', to: ['advisor', 'target', 'strategy', 'settings'], type: 'bidirectional' }
    ],
    recommended: [
      { from: 'dashboard', to: ['advisor'], type: 'primary', label: 'AI戦略分析を開始' },
      { from: 'advisor', to: ['target'], type: 'primary', label: 'ターゲット分析に進む' },
      { from: 'target', to: ['strategy'], type: 'primary', label: '戦略マップを作成' },
      { from: 'strategy', to: ['dashboard'], type: 'secondary', label: '結果を確認' }
    ],
    action: [
      { from: 'dashboard', to: ['advisor'], type: 'action', label: 'クイック分析' },
      { from: 'advisor', to: ['dashboard'], type: 'result', label: '結果確認' },
      { from: 'dashboard', to: ['target'], type: 'action', label: '市場分析' },
      { from: 'target', to: ['strategy'], type: 'planning', label: '戦略策定' }
    ]
  };

  const handleScreenClick = (screenId: string) => {
    onViewChange(screenId);
    onShowFlow();
  };

  const getScreenPosition = (index: number) => {
    const positions = {
      desktop: [
        { x: '10%', y: '20%' },  // dashboard
        { x: '30%', y: '10%' },  // advisor
        { x: '50%', y: '20%' },  // target
        { x: '70%', y: '10%' },  // strategy
        { x: '85%', y: '30%' }   // settings
      ],
      tablet: [
        { x: '20%', y: '15%' },
        { x: '20%', y: '35%' },
        { x: '20%', y: '55%' },
        { x: '60%', y: '25%' },
        { x: '60%', y: '45%' }
      ],
      mobile: [
        { x: '50%', y: '10%' },
        { x: '50%', y: '25%' },
        { x: '50%', y: '40%' },
        { x: '50%', y: '55%' },
        { x: '50%', y: '70%' }
      ]
    };
    return positions[viewMode][index];
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-serif font-semibold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
            devCatalist 画面遷移図
          </h1>
          <div className="w-3 h-3 bg-gold rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <p className="text-muted-foreground text-lg">
          インタラクティブな画面フロー・ビジュアライゼーション
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        {/* Flow Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium gold-soft-text">表示フロー</label>
          <div className="flex gap-2">
            <Button
              variant={selectedFlow === 'recommended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFlow('recommended')}
              className={`${selectedFlow === 'recommended' ? 'bg-gold text-navy-deepest' : 'border-gold/30 gold-soft-text hover:bg-gold/10'} transition-all duration-200`}
            >
              推奨フロー
            </Button>
            <Button
              variant={selectedFlow === 'basic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFlow('basic')}
              className={`${selectedFlow === 'basic' ? 'bg-gold text-navy-deepest' : 'border-gold/30 gold-soft-text hover:bg-gold/10'} transition-all duration-200`}
            >
              基本ナビ
            </Button>
            <Button
              variant={selectedFlow === 'action' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFlow('action')}
              className={`${selectedFlow === 'action' ? 'bg-gold text-navy-deepest' : 'border-gold/30 gold-soft-text hover:bg-gold/10'} transition-all duration-200`}
            >
              アクション
            </Button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium gold-soft-text">表示モード</label>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className={`${viewMode === 'desktop' ? 'bg-bronze text-navy-deepest' : 'border-bronze/30 text-bronze hover:bg-bronze/10'} transition-all duration-200`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className={`${viewMode === 'tablet' ? 'bg-bronze text-navy-deepest' : 'border-bronze/30 text-bronze hover:bg-bronze/10'} transition-all duration-200`}
            >
              <Tablet className="w-4 h-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className={`${viewMode === 'mobile' ? 'bg-bronze text-navy-deepest' : 'border-bronze/30 text-bronze hover:bg-bronze/10'} transition-all duration-200`}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onShowFlow}
            className="bg-gradient-to-r from-gold to-bronze text-navy-deepest"
          >
            <Eye className="w-4 h-4 mr-2" />
            実画面を表示
          </Button>
        </div>
      </div>

      {/* Flow Diagram */}
      <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl min-h-[600px] relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-semibold">画面遷移フロー</h3>
            <Badge className="bg-gold/10 gold-soft-text border-gold/30">
              {selectedFlow === 'recommended' && '推奨フロー'}
              {selectedFlow === 'basic' && '基本ナビゲーション'}
              {selectedFlow === 'action' && 'アクションベース'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative h-[500px]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #d4af37 0%, transparent 50%),
                                  radial-gradient(circle at 75% 75%, #b8860b 0%, transparent 50%)`
            }} />

          {/* Screen Nodes */}
          {screens.map((screen, index) => {
            const position = getScreenPosition(index);
            const Icon = screen.icon;
            const isActive = currentView === screen.id;

            return (
              <div
                key={screen.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: position.x, top: position.y }}
                onClick={() => handleScreenClick(screen.id)}
              >
                <div className={`
                  relative w-32 h-24 md:w-40 md:h-28 rounded-xl border-2 transition-all duration-300
                  ${isActive
                    ? 'border-gold shadow-lg shadow-gold/25 scale-110'
                    : 'border-gold/30 hover:border-gold/60 hover:scale-105'
                  }
                  bg-gradient-to-br ${screen.color} p-1
                `}>
                  <div className="w-full h-full bg-navy-dark/90 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                    <Icon className={`w-6 h-6 mb-2 transition-colors duration-200 ${isActive ? 'gold-soft-text' : 'gold-soft-text/70 hover:gold-soft-text/90'}`} />
                    <h4 className="text-xs font-semibold text-foreground leading-tight">
                      {screen.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {screen.subtitle}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className={`
                    absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-navy-dark flex items-center justify-center
                    ${screen.status === 'active' ? 'bg-gold' : 'bg-bronze/60'}
                  `}>
                    {screen.status === 'active' ? (
                      <Zap className="w-3 h-3 text-navy-dark" />
                    ) : (
                      <RefreshCw className="w-3 h-3 text-navy-dark" />
                    )}
                  </div>
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <div className="bg-navy-darker border border-gold/20 rounded-lg p-3 shadow-xl min-w-48">
                    <h5 className="font-semibold gold-soft-text mb-1">{screen.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{screen.description}</p>
                    <div className="space-y-1">
                      {screen.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="text-xs text-foreground/80">• {feature}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Flow Arrows */}
          {flows[selectedFlow]?.map((flow, index) => {
            const fromIndex = screens.findIndex(s => s.id === flow.from);
            const fromPos = getScreenPosition(fromIndex);

            return flow.to.map((toId, toIndex) => {
              const toScreenIndex = screens.findIndex(s => s.id === toId);
              const toPos = getScreenPosition(toScreenIndex);

              return (
                <svg
                  key={`${flow.from}-${toId}-${index}-${toIndex}`}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${index}-${toIndex}`}
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={flow.type === 'primary' ? '#d4af37' : '#cd7f32'}
                      />
                    </marker>
                  </defs>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={flow.type === 'primary' ? '#d4af37' : '#cd7f32'}
                    strokeWidth="2"
                    strokeDasharray={flow.type === 'secondary' ? '5,5' : 'none'}
                    markerEnd={`url(#arrowhead-${index}-${toIndex})`}
                    opacity="0.8"
                  />
                  {/* {flow.label && (
                    <text
                      x={(parseFloat(fromPos.x) + parseFloat(toPos.x)) / 2 + '%'}
                      y={(parseFloat(fromPos.y) + parseFloat(toPos.y)) / 2 + '%'}
                      fill="#d4af37"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-medium"
                    >
                      {flow.label}
                    </text>
                  )} */}
                </svg>
              );
            });
          })}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gold/20 bg-navy-dark/30 backdrop-blur-sm">
          <CardHeader>
            <h4 className="font-semibold gold-soft-text">フロータイプ</h4>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-gold"></div>
              <span>推奨フロー（新規ユーザー）</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-bronze border-dashed"></div>
              <span>基本ナビゲーション</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-copper"></div>
              <span>アクションベース</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gold/20 bg-navy-dark/30 backdrop-blur-sm">
          <CardHeader>
            <h4 className="font-semibold gold-soft-text">画面ステータス</h4>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 gold-soft-text" />
              <span>実装完了</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-bronze" />
              <span>開発中</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gold/20 bg-navy-dark/30 backdrop-blur-sm">
          <CardHeader>
            <h4 className="font-semibold gold-soft-text">操作方法</h4>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-bronze" />
              <span>画面ノードをクリック</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-copper" />
              <span>実画面プレビュー</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}