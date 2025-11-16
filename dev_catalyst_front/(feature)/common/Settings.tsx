import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Crown,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { SettingsProps } from './types';

export function Settings({ onShowPlanManagement }: SettingsProps) {
  const aiAssistants = [
    {
      id: 'aria-celestia',
      name: 'Aria Celestia',
      role: '静謐な戦略パートナー',
      description: '落ち着いた洞察と緻密な提案で、深夜の意思決定を支える。',
      strengths: ['静かな共感', '構造的な思考整理', '長期戦略の視座'],
      palette: 'from-gold/20 via-gold/10 to-transparent',
      image: '/aria-celestia.png',
    },
    {
      id: 'aria-nocturne',
      name: 'Aria Nocturne',
      role: '夜型の実行支援ナビゲーター',
      description: '夜間のタスク管理と実行計画づくりにフォーカスしたアシスト。',
      strengths: ['意思決定の迅速化', '実行ロードマップ', '感情の整理'],
      palette: 'from-navy-medium/80 via-navy-medium/40 to-transparent',
      image: '/aria-nocturne.png',
    },
    {
      id: 'aria-orbit',
      name: 'Aria Orbit',
      role: '市場感覚に敏感な参謀',
      description: 'トレンド捕捉と競合動向の可視化で、次の打ち手を導く。',
      strengths: ['市場洞察', 'ポジショニング分析', 'リスク評価'],
      palette: 'from-cyan/30 via-gold/10 to-transparent',
      image: '/aria-orbit.png',
    },
  ];

  const [profile, setProfile] = useState({
    name: '田中 太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    location: '東京都渋谷区',
    company: 'DevCatalist株式会社',
    bio: 'テクノロジーを活用したソロプレナー。AI・SaaS分野で事業展開中。',
    website: 'https://example.com',
    assistantId: aiAssistants[0]?.id ?? 'aria-celestia',
  });

  const activeAssistant =
    aiAssistants.find((assistant) => assistant.id === profile.assistantId) ?? aiAssistants[0];

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: true,
    weeklyReport: true,
    marketingEmails: false,
    aiInsights: true,
    strategyAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    analyticsSharing: true,
    dataCollection: true,
  });

  const subscriptionInfo = {
    plan: 'プロフェッショナル',
    status: 'アクティブ',
    nextBilling: '2024年11月15日',
    amount: '¥9,800/月',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">設定</h2>
        <p className="text-muted-foreground">アカウント、通知、プライバシー設定を管理</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="privacy">プライバシー</TabsTrigger>
          <TabsTrigger value="billing">請求</TabsTrigger>
          <TabsTrigger value="data">データ</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>プロフィール情報</span>
              </CardTitle>
              <CardDescription>公開されるプロフィール情報を編集</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={activeAssistant?.image ?? '/api/placeholder/80/80'}
                    alt={activeAssistant?.name ?? 'AI Assistant'}
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <Button size="sm" className="mb-2">
                    <Camera className="w-4 h-4 mr-2" />
                    写真を変更
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG、PNG形式。最大5MB。</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    現在の担当AI：{activeAssistant?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">氏名</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <div className="flex space-x-2">
                    <Mail className="w-4 h-4 mt-3 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <div className="flex space-x-2">
                    <Phone className="w-4 h-4 mt-3 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">所在地</Label>
                  <div className="flex space-x-2">
                    <MapPin className="w-4 h-4 mt-3 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company">会社・事業名</Label>
                  <div className="flex space-x-2">
                    <Briefcase className="w-4 h-4 mt-3 text-muted-foreground" />
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">自己紹介</Label>
                  <Textarea
                    id="bio"
                    placeholder="あなたの事業や専門分野について簡潔に紹介してください"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">キャンセル</Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  変更を保存
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>担当AIを選択</span>
              </CardTitle>
              <CardDescription>
                あなたの思考スタイルに寄り添うAIパートナーを選び、Ariaとの対話を最適化
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiAssistants.map((assistant) => {
                  const isActive = assistant.id === profile.assistantId;
                  return (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => setProfile((prev) => ({ ...prev, assistantId: assistant.id }))}
                      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left focus:outline-none ${
                        isActive
                          ? 'border-gold/60 shadow-[0_18px_40px_-18px_rgba(217,178,116,0.65)]'
                          : 'border-transparent hover:border-gold/30 hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.35)]'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${assistant.palette} opacity-80`}
                      />
                      <div className="relative flex flex-col h-full p-5 space-y-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            className={`w-16 h-16 ring-2 ${isActive ? 'ring-gold/80' : 'ring-transparent'} transition`}
                          >
                            <AvatarImage src={assistant.image} alt={assistant.name} />
                            <AvatarFallback>{assistant.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-base">{assistant.name}</h3>
                              {isActive && (
                                <Badge className="bg-gold/20 text-aria-dark-soft border-gold/40 flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>選択中</span>
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{assistant.role}</p>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                          {assistant.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          {assistant.strengths.map((strength) => (
                            <Badge
                              key={strength}
                              variant="outline"
                              className={`backdrop-blur-sm ${isActive ? 'border-gold/50 text-aria-dark-soft bg-gold/15' : 'border-white/30 text-white/80 bg-white/10'}`}
                            >
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>AIパートナーとの関係を整える</span>
              </CardTitle>
              <CardDescription>
                選択したAIと対話を始める前に、簡単なウォームアップを設定できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-dashed border-gold/30 rounded-xl p-5 bg-gold/5 text-sm text-muted-foreground">
                選択したAIに今の状況や目標を共有すると、提案の精度が向上します。準備ができたら、
                <span className="gold-soft-text font-medium">「最初の対話を始める」</span>
                をクリックしてください。
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">準備メモを書く</Button>
                <Button className="aria-gold-surface text-aria-dark-soft">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  最初の対話を始める
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>通知設定</span>
              </CardTitle>
              <CardDescription>受け取りたい通知の種類を選択</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">メール通知</div>
                    <div className="text-sm text-muted-foreground">
                      重要な更新情報をメールで受信
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailUpdates}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, emailUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">プッシュ通知</div>
                    <div className="text-sm text-muted-foreground">
                      ブラウザでのプッシュ通知を有効化
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">週次レポート</div>
                    <div className="text-sm text-muted-foreground">毎週の進捗レポートを配信</div>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">AI戦略インサイト</div>
                    <div className="text-sm text-muted-foreground">新しいAI分析結果の通知</div>
                  </div>
                  <Switch
                    checked={notifications.aiInsights}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, aiInsights: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">戦略アラート</div>
                    <div className="text-sm text-muted-foreground">
                      重要なマイルストーンや期限の通知
                    </div>
                  </div>
                  <Switch
                    checked={notifications.strategyAlerts}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, strategyAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">マーケティングメール</div>
                    <div className="text-sm text-muted-foreground">新機能やプロモーション情報</div>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({ ...notifications, marketingEmails: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>プライバシー設定</span>
              </CardTitle>
              <CardDescription>データの使用方法とプライバシー設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">プロフィール公開</div>
                    <div className="text-sm text-muted-foreground">
                      他のユーザーがあなたのプロフィールを見ることができます
                    </div>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacy({ ...privacy, profilePublic: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">分析データ共有</div>
                    <div className="text-sm text-muted-foreground">
                      匿名化された使用データを改善のために共有
                    </div>
                  </div>
                  <Switch
                    checked={privacy.analyticsSharing}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacy({ ...privacy, analyticsSharing: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">データ収集</div>
                    <div className="text-sm text-muted-foreground">
                      パーソナライズされたエクスペリエンスのためのデータ収集
                    </div>
                  </div>
                  <Switch
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacy({ ...privacy, dataCollection: checked })
                    }
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">データの取り扱いについて</h4>
                <p className="text-sm text-muted-foreground">
                  DevCatalistは、お客様のプライバシーを重視しています。
                  収集されたデータは、サービスの改善とパーソナライズされた体験の提供のみに使用されます。
                  詳細については、プライバシーポリシーをご確認ください。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>請求情報</span>
              </CardTitle>
              <CardDescription>サブスクリプションと請求の管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>現在のプラン</Label>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">{subscriptionInfo.plan}</Badge>
                        <Badge variant="outline">{subscriptionInfo.status}</Badge>
                      </div>
                      {onShowPlanManagement && (
                        <Button
                          onClick={onShowPlanManagement}
                          size="sm"
                          className="bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          プラン管理
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>月額料金</Label>
                    <div className="text-2xl font-bold mt-1">{subscriptionInfo.amount}</div>
                  </div>

                  <div>
                    <Label>次回請求日</Label>
                    <div className="mt-1">{subscriptionInfo.nextBilling}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>支払い方法</Label>
                    <div className="flex items-center space-x-2 mt-1 p-3 border rounded-lg">
                      <CreditCard className="w-4 h-4" />
                      <span>**** **** **** 1234</span>
                      <Badge variant="outline">VISA</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      支払い方法を変更
                    </Button>
                    <Button variant="outline" className="w-full">
                      請求履歴を確認
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">プラン変更</h4>
                <p className="text-sm text-blue-800 mb-3">
                  より多くの機能とAI分析を利用できるエンタープライズプランもご用意しています。
                </p>
                <Button variant="outline" size="sm">
                  プランを比較
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>データ管理</span>
              </CardTitle>
              <CardDescription>データのエクスポート、削除、アカウント管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">データエクスポート</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    あなたのすべてのデータ（プロジェクト、分析結果、設定など）をダウンロード
                  </p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    データをダウンロード
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">キャッシュクリア</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    ローカルに保存されているキャッシュデータを削除してアプリをリフレッシュ
                  </p>
                  <Button variant="outline">キャッシュをクリア</Button>
                </div>

                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-red-600">危険な操作</h4>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm">すべてのデータを削除</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        すべてのプロジェクト、分析結果、設定が完全に削除されます
                      </p>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        データを削除
                      </Button>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm">アカウント削除</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        アカウントとすべての関連データが完全に削除されます
                      </p>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        アカウントを削除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
