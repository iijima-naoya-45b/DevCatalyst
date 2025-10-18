import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  CreditCard, 
  Crown, 
  Zap, 
  Shield, 
  Check, 
  X, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
  Settings,
  HelpCircle
} from "lucide-react";

export function PlanManagement() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: '個人・小規模事業向け',
      icon: Sparkles,
      color: 'from-bronze to-copper',
      monthlyPrice: 2980,
      yearlyPrice: 29800,
      features: [
        'AI戦略分析 月5回',
        'ターゲット分析 月3回', 
        '基本レポート出力',
        'メールサポート',
        'データ保存期間 3ヶ月'
      ],
      limits: {
        aiAnalysis: 5,
        targetAnalysis: 3,
        projects: 2
      }
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'ソロプレナー・成長企業向け',
      icon: Crown,
      color: 'from-gold to-bronze',
      monthlyPrice: 9800,
      yearlyPrice: 98000,
      features: [
        'AI戦略分析 無制限',
        'ターゲット分析 無制限',
        '詳細レポート・戦略マップ',
        '優先サポート',
        'データ保存期間 1年',
        'API連携',
        'チームメンバー追加 最大3名'
      ],
      limits: {
        aiAnalysis: -1, // unlimited
        targetAnalysis: -1,
        projects: 10
      },
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: '大企業・コンサルティング向け',
      icon: Shield,
      color: 'from-silver to-gold',
      monthlyPrice: 29800,
      yearlyPrice: 298000,
      features: [
        'すべてのPro機能',
        'カスタムAIモデル',
        '専用サポート',
        'データ無期限保存',
        'SSO・セキュリティ強化',
        'カスタム統合',
        'チームメンバー無制限'
      ],
      limits: {
        aiAnalysis: -1,
        targetAnalysis: -1,
        projects: -1
      }
    }
  ];

  const currentPlanData = plans.find(p => p.id === currentPlan);
  
  const usage = {
    aiAnalysis: { used: 3, limit: currentPlanData?.limits.aiAnalysis || 5 },
    targetAnalysis: { used: 1, limit: currentPlanData?.limits.targetAnalysis || 3 },
    projects: { used: 2, limit: currentPlanData?.limits.projects || 2 }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return (used / limit) * 100;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP').format(price);
  };

  const handleUpgrade = (planId: string) => {
    // Mock Stripe integration
    console.log(`Upgrading to ${planId}`);
    setCurrentPlan(planId);
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
          <h1 className="text-3xl font-serif font-semibold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
            プラン管理
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          現在のプラン状況と使用量の確認、アップグレード・ダウングレードが可能です
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentPlanData?.color} flex items-center justify-center`}>
                {currentPlanData?.icon && <currentPlanData.icon className="w-6 h-6 text-navy-deepest" />}
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{currentPlanData?.name}</span>
                  {currentPlanData?.recommended && (
                    <Badge className="bg-gold text-navy-deepest">おすすめ</Badge>
                  )}
                </CardTitle>
                <CardDescription>{currentPlanData?.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ¥{formatPrice(billingCycle === 'monthly' ? currentPlanData?.monthlyPrice || 0 : currentPlanData?.yearlyPrice || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                /{billingCycle === 'monthly' ? '月' : '年'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold">今月の使用状況</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI戦略分析</span>
                  <span className="text-gold">
                    {usage.aiAnalysis.used}/{usage.aiAnalysis.limit === -1 ? '無制限' : usage.aiAnalysis.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.aiAnalysis.used, usage.aiAnalysis.limit)}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ターゲット分析</span>
                  <span className="text-bronze">
                    {usage.targetAnalysis.used}/{usage.targetAnalysis.limit === -1 ? '無制限' : usage.targetAnalysis.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.targetAnalysis.used, usage.targetAnalysis.limit)}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>アクティブプロジェクト</span>
                  <span className="text-copper">
                    {usage.projects.used}/{usage.projects.limit === -1 ? '無制限' : usage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.projects.used, usage.projects.limit)}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center space-x-4 p-4 bg-gold/5 rounded-lg border border-gold/20">
            <div className="flex items-center space-x-2">
              <span className={billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}>月額</span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked: boolean) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}>年額</span>
            </div>
            {billingCycle === 'yearly' && (
              <Badge variant="outline" className="border-gold text-gold bg-gold/10">
                2ヶ月分お得
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gold/30 text-gold">
              <Download className="w-4 h-4 mr-2" />
              請求書ダウンロード
            </Button>
            <Button variant="outline" className="border-bronze/30 text-bronze">
              <Settings className="w-4 h-4 mr-2" />
              支払い方法変更
            </Button>
            <Button variant="outline" className="border-copper/30 text-copper">
              <Calendar className="w-4 h-4 mr-2" />
              請求履歴
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold">プラン比較・変更</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === currentPlan;
            
            return (
              <Card key={plan.id} className={`
                relative border transition-all duration-300 hover:shadow-lg
                ${isCurrentPlan 
                  ? 'border-gold shadow-xl shadow-gold/20 bg-gradient-to-br from-gold/10 to-transparent' 
                  : 'border-gold/25 bg-navy-dark/40 hover:border-gold/40'
                }
                backdrop-blur-md
              `}>
                {plan.recommended && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-gold to-bronze text-navy-deepest px-4 py-1">
                      おすすめ
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-navy-deepest" />
                  </div>
                  <CardTitle className="text-xl font-serif">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      ¥{formatPrice(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      /{billingCycle === 'monthly' ? '月' : '年'}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full ${
                      isCurrentPlan
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : plan.recommended
                        ? 'bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light'
                        : 'bg-gradient-to-r from-bronze to-copper text-navy-deepest hover:from-bronze-light hover:to-copper-light'
                    }`}
                  >
                    {isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        現在のプラン
                      </>
                    ) : (
                      <>
                        {currentPlan === 'starter' ? 'アップグレード' : plan.id === 'starter' ? 'ダウングレード' : 'プラン変更'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Cancellation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gold" />
              <span>支払い方法</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gold/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <div className="font-medium">**** **** **** 1234</div>
                  <div className="text-sm text-muted-foreground">有効期限: 12/26</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold">
                変更
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>次回請求日</span>
                <span className="font-medium">2024年11月15日</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>請求額</span>
                <span className="font-medium">¥{formatPrice(currentPlanData?.monthlyPrice || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <span>アカウント管理</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-orange-400/30 text-orange-400 hover:bg-orange-400/5"
                onClick={() => setShowCancelDialog(true)}
              >
                <X className="w-4 h-4 mr-2" />
                プランをキャンセル
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-blue-400/30 text-blue-400 hover:bg-blue-400/5"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                サポートに連絡
              </Button>
            </div>
            
            {showCancelDialog && (
              <div className="p-4 border border-orange-400/20 rounded-lg bg-orange-400/5">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-orange-400">プランキャンセルの確認</h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        キャンセル後も現在の請求期間終了まではサービスをご利用いただけます。
                        データは90日間保持されます。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelDialog(false)}
                      className="border-muted-foreground/30"
                    >
                      やめる
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        console.log('Plan cancelled');
                        setShowCancelDialog(false);
                      }}
                    >
                      キャンセル実行
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}