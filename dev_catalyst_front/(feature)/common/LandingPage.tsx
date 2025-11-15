import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AriaChat } from "./AriaChat";
import { 
  Sparkles,
  TrendingUp,
  Target,
  Brain,
  Users,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
  PlayCircle,
  Clock,
  Globe,
  Building,
  Crown,
  Lightbulb,
  PieChart,
  LineChart,
  Activity,
  Briefcase,
  Timer
} from "lucide-react";
import { LandingPageProps } from "./types";

export function LandingPage({ onStartTrial, onShowDemo }: LandingPageProps) {
  const [showAriaDemo, setShowAriaDemo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // ヒーローセクションの統計
  const heroStats = [
    { value: "30%", label: "意思決定速度向上", icon: Clock },
    { value: "2ヶ月", label: "事業立ち上げ期間短縮", icon: TrendingUp },
    { value: "89%", label: "戦略成功確率", icon: Target },
    { value: "24/7", label: "AIパートナー稼働", icon: Brain }
  ];

  // 主要機能
  const mainFeatures = [
    {
      id: 'ideation',
      title: 'アイデア壁打ち',
      subtitle: 'Interactive Brainstorming',
      description: 'アリアとの対話を通じて、あなたのビジネスアイデアを体系化。マインドマップ自動生成で思考を可視化します。',
      icon: Lightbulb,
      color: 'gold-soft-gradient',
      demo: '「新しいSaaSアイデアがあるんですが...」\n→「市場性はいかがでしょうか？具体的な課題は？」\n→「では競合状況を分析しましょう」',
      benefits: ['思考の整理', 'アイデア深掘り', '盲点の発見', '実現性評価']
    },
    {
      id: 'competitive',
      title: '競合分析',
      subtitle: 'AI-Powered Analysis',
      description: '自動データ収集と分析により、詳細な競合レーダーチャートとレポートを生成。差別化ポイントを明確化します。',
      icon: Target,
      color: 'from-bronze to-copper',
      demo: '「競合他社の動向が気になります」\n→「主要3社の詳細分析をお見せします」\n→「あなたの優位性はここです」',
      benefits: ['市場ポジション把握', '差別化戦略', '価格戦略立案', '参入タイミング']
    },
    {
      id: 'planning',
      title: '事業計画',
      subtitle: 'Strategic Roadmap',
      description: 'SWOT分析から財務シミュレーションまで、包括的な事業計画を対話形式で構築します。',
      icon: BarChart3,
      color: 'gold-soft-gradient',
      demo: '「事業計画を立てたいのですが」\n→「収益モデルから始めましょうか」\n→「3年後の予測をお見せします」',
      benefits: ['収益予測', 'リスク分析', '資金計画', 'KPI設定']
    }
  ];

  // 導入ステップ
  const onboardingSteps = [
    {
      step: 1,
      title: 'アカウント作成',
      description: 'メールまたはSNS認証で最短30秒',
      icon: Users,
      time: '30秒'
    },
    {
      step: 2,
      title: 'プロフィール設定',
      description: 'あなたの事業領域をアリアに教える',
      icon: Briefcase,
      time: '2分'
    },
    {
      step: 3,
      title: 'アリアとの初回対話',
      description: '現在の課題や目標をヒアリング',
      icon: MessageSquare,
      time: '3分'
    },
    {
      step: 4,
      title: '戦略セッション開始',
      description: 'パーソナライズされた分析を体験',
      icon: Brain,
      time: '即座に'
    }
  ];

  // プラン
  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: '¥0',
      period: '永続無料',
      description: 'まずは試してみたい方向け',
      features: [
        'AI戦略セッション（月5回まで）',
        '基本的な競合分析（月3回まで）',
        'アイデア壁打ち（月3回まで）',
        '事業計画テンプレート',
        'メールサポート'
      ],
      cta: '無料で始める',
      popular: false
    },
    {
      id: 'pro',
      name: 'PROFESSIONAL',
      price: '¥9,800',
      period: '月額',
      description: '本格的に事業を進める方向け',
      features: [
        'アリアとの無制限対話',
        '詳細な競合・市場分析（無制限）',
        '事業計画自動生成（無制限）',
        '財務シミュレーション',
        '優先サポート',
        'データエクスポート'
      ],
      cta: '14日間無料トライアル',
      popular: true
    }
  ];

  // 顧客事例
  const testimonials = [
    {
      name: '田中 健一',
      title: 'スタートアップCEO',
      company: 'TechVenture Inc.',
      content: '孤独な意思決定から解放されました。アリアとの対話で、データに基づく確信を持って戦略を進められるようになりました。',
      result: '事業立ち上げ期間 2ヶ月短縮',
      avatar: '/api/placeholder/64/64'
    },
    {
      name: '佐藤 美香',
      title: '事業責任者',
      company: 'Global Solutions Ltd.',
      content: '複雑な市場分析が、アリアとの対話でこんなにシンプルに。競合への対策も明確になり、チーム全体の方向性が統一されました。',
      result: '意思決定速度 40%向上',
      avatar: '/api/placeholder/64/64'
    },
    {
      name: '山田 一郎',
      title: '戦略コンサルタント',
      company: 'Strategy Partners',
      content: 'クライアントへの提案品質が格段に向上。アリアの分析力は人間のコンサルタントの強力なパートナーです。',
      result: '提案成約率 35%向上',
      avatar: '/api/placeholder/64/64'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deepest via-navy-darker to-navy-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 gold-soft-gradient opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-bronze/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto text-center relative z-10">
          {/* Service Logo & Name */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 gold-soft-gradient rounded-xl flex items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-aria-dark-soft" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold gold-soft-text">
                devCatalist
              </h1>
              <p className="gold-soft-text/70 text-sm tracking-wide">Powered by AI Strategy Partner "Aria"</p>
            </div>
          </div>

          {/* Main Headline */}
          <div className="max-w-5xl mx-auto mb-12">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
              <span className="text-foreground">
                戦略の
              </span>
              <span className="gold-soft-text">
                孤独
              </span>
              <span className="text-foreground">
                から、
              </span>
              <br />
              <span className="gold-soft-text">
                確信の対話
              </span>
              <span className="text-foreground">
                へ。
              </span>
            </h2>

            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                78%の経営者が感じる「戦略立案の孤独」を解決。<br />
                AIパートナー「<strong className="gold-soft-text">アリア</strong>」との対話で、データに基づく確信ある意思決定を実現。
              </p>

              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>意思決定速度 30%向上</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>戦略成功確率 89%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>立ち上げ期間 2ヶ月短縮</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-8 mb-16">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={onStartTrial}
                className="h-16 px-12 text-lg aria-gold-surface transform hover:scale-105 transition-all duration-300"
              >
                <Brain className="w-6 h-6 mr-3" />
                アリアと戦略セッション開始
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              <Button
                onClick={() => setShowAriaDemo(!showAriaDemo)}
                variant="outline"
                className="h-16 px-12 text-lg border-gold/40 gold-soft-text hover:bg-gold/10 backdrop-blur-sm"
              >
                <PlayCircle className="w-6 h-6 mr-3" />
                5分でわかるライブデモ
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ✓ クレジットカード不要　✓ 30秒でセットアップ完了　✓ 今なら14日間無料
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Timer className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">限定：今月あと17枠</span>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 gold-soft-text" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold gold-soft-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aria Demo Section */}
      {showAriaDemo && (
        <section className="py-20 px-4 border-t border-gold/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-gold/10 gold-soft-text border-gold/30 mb-4">
                LIVE DEMO
              </Badge>
              <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                パートナーAI「アリア」との戦略セッション
              </h3>
              <p className="text-muted-foreground text-lg">
                実際にアリアと対話して、AIの戦略支援力を体験してください
              </p>
            </div>
            <AriaChat onStartAnalysis={onStartTrial} showUserAvatar={false} />
          </div>
        </section>
      )}

      {/* Service Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-semibold mb-6">
              迷いを自信に変える戦略ダッシュボード
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              「データ」ではなく「確信」が得られる。未来の不確実性をクリアにする、
              革新的なAI戦略支援プラットフォーム。
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                    <div className="text-4xl font-bold gold-soft-text mb-2">78%</div>
                    <div className="text-sm text-muted-foreground">AI予測成功確率</div>
                    <div className="text-xs gold-soft-text mt-1">リスクレベル: 低</div>
                  </div>
                  <div className="text-center p-6 bg-bronze/5 rounded-xl border border-bronze/20">
                    <div className="text-lg font-semibold text-bronze mb-2">次の一手</div>
                    <div className="text-sm text-muted-foreground">MVP開発に注力</div>
                    <div className="text-xs text-bronze mt-1">推奨タイミング: 今すぐ</div>
                  </div>
                  <div className="text-center p-6 bg-copper/5 rounded-xl border border-copper/20">
                    <div className="text-lg font-semibold text-copper mb-2">市場動向</div>
                    <div className="text-sm text-muted-foreground">成長期（+15%）</div>
                    <div className="text-xs text-copper mt-1">参入好機</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <Clock className="w-12 h-12 gold-soft-text mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">時間の節約</h4>
              <p className="text-muted-foreground">複雑な分析を数分で完了</p>
            </div>
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-bronze mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">リスクの最小化</h4>
              <p className="text-muted-foreground">データに基づく確実な判断</p>
            </div>
            <div className="text-center p-6">
              <TrendingUp className="w-12 h-12 text-copper mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">自信の醸成</h4>
              <p className="text-muted-foreground">確信を持った戦略実行</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 bg-navy-dark/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-semibold mb-6">
              パートナーAI「アリア」との戦略セッション
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              「機能」ではなく「セッション（対話）」。アリアとの知的な対話を通じて、
              あなただけの戦略インサイトを発見してください。
            </p>
          </div>

          <div className="space-y-12">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className={`flex flex-col transition-all duration-500 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 hover:scale-[1.02]`}>
                  {/* Feature Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-navy-deepest" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-serif font-semibold">{feature.title}</h4>
                        <p className="gold-soft-text text-sm">{feature.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 gold-soft-text" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Demo */}
                  <div className="flex-1">
                    <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                              <Brain className="w-4 h-4 text-navy-deepest" />
                            </div>
                            <span className="text-sm font-medium gold-soft-text">アリアとの対話例</span>
                          </div>
                          <div className="text-sm whitespace-pre-line text-muted-foreground leading-relaxed font-mono">
                            {feature.demo}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-semibold mb-6">
              最短5分で、あなたの戦略パートナーに。
            </h3>
            <p className="text-xl text-muted-foreground">
              シンプルなステップで、すぐにアリアとの戦略セッションを開始できます
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {onboardingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center relative">
                    {index < onboardingSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 gold-soft-gradient transform translate-x-4 -translate-y-1/2" />
                    )}

                    <div className="w-16 h-16 gold-soft-gradient rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <Icon className="w-8 h-8 text-aria-dark-soft" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm gold-soft-text font-medium">STEP {step.step}</div>
                      <h4 className="text-lg font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <Badge variant="outline" className="border-gold/30 gold-soft-text text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.time}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-navy-dark/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-semibold mb-6">
              あなたに最適なプランを選択
            </h3>
            <p className="text-xl text-muted-foreground">
              無料プランで試して、本格的な戦略立案はプロフェッショナルプランで
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`
                relative border transition-all duration-300 hover:shadow-2xl
                ${plan.popular
                  ? 'gold-soft-outline aria-gold-surface/40 scale-105'
                  : 'border-gold/25 bg-navy-dark/40 hover:border-gold/40'
                }
                backdrop-blur-md
              `}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gold-soft-gradient text-aria-dark-soft px-6 py-2 shadow-sm">
                      <Crown className="w-4 h-4 mr-2" />
                      最も人気
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-serif mb-2">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 gold-soft-text flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={onStartTrial}
                    className={`w-full h-12 ${plan.popular
                        ? 'aria-gold-surface'
                        : 'bg-gradient-to-r from-bronze to-copper text-navy-deepest hover:from-bronze-light hover:to-copper-light'
                      }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-semibold mb-6">
              孤独な意思決定から解放された、リーダーたちの声
            </h3>
            <p className="text-xl text-muted-foreground">
              データに基づく確信を手に入れた経営者・事業責任者の体験談
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md hover:shadow-xl hover:shadow-gold/10 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 gold-soft-text fill-current" />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
                    <div className="text-sm font-medium gold-soft-text">{testimonial.result}</div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gold/20">
                    <div className="w-12 h-12 gold-soft-gradient rounded-full flex items-center justify-center">
                      <span className="text-aria-dark-soft font-semibold text-sm">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                      <div className="text-xs gold-soft-text">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-navy-dark via-navy to-navy-dark">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-4xl md:text-5xl font-serif font-bold">
              あなたの戦略パートナー「アリア」が
              <br />
              <span className="gold-soft-text">
                待っています
              </span>
            </h3>

            <p className="text-xl text-muted-foreground leading-relaxed">
              複雑な戦略立案の孤独から解放されて、データに基づく確信を手に入れましょう。
              <br />
              今すぐアリアとの戦略セッションを始めてください。
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={onStartTrial}
                className="h-16 px-12 text-lg aria-gold-surface transform hover:scale-105 transition-all duration-300"
              >
                <Brain className="w-6 h-6 mr-3" />
                14日間無料でアリアと対話
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              クレジットカード不要 • 最短30秒でセットアップ完了 • いつでもキャンセル可能
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}