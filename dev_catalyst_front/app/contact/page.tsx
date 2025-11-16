'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../(feature)/common/ui/card';
import { Button } from '../../(feature)/common/ui/button';
import { Input } from '../../(feature)/common/ui/input';
import { Textarea } from '../../(feature)/common/ui/textarea';
import { Label } from '../../(feature)/common/ui/label';
import { Separator } from '../../(feature)/common/ui/separator';
import { Mail, Phone, MapPin, Shield, FileText, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/70 to-background">
      {/* Header */}
      <div className="bg-navy-dark/30 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 gold-soft-text">
              お問い合わせ・法的情報
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              devCatalist〈Vertex〉に関するお問い合わせ、利用規約、プライバシーポリシーについて
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* お問い合わせフォーム */}
          <div className="lg:col-span-2">
            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-serif gold-soft-text flex items-center">
                  <Mail className="w-6 h-6 mr-3" />
                  お問い合わせ
                </CardTitle>
                <p className="text-muted-foreground">
                  ご質問、ご要望、技術的なお問い合わせはこちらからお送りください
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="gold-soft-text font-medium">
                      お名前 *
                    </Label>
                    <Input
                      id="name"
                      placeholder="山田太郎"
                      className="bg-navy-dark/80 border-gold/20 focus:border-gold/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="gold-soft-text font-medium">
                      メールアドレス *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="bg-navy-dark/80 border-gold/20 focus:border-gold/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="gold-soft-text font-medium">
                    件名 *
                  </Label>
                  <Input
                    id="subject"
                    placeholder="お問い合わせの件名"
                    className="bg-navy-dark/80 border-gold/20 focus:border-gold/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="gold-soft-text font-medium">
                    メッセージ *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="お問い合わせ内容を詳しくお書きください"
                    className="min-h-[200px] bg-navy-dark/80 border-gold/20 focus:border-gold/40"
                  />
                </div>

                <Button className="w-full aria-gold-surface font-semibold">送信する</Button>
              </CardContent>
            </Card>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-6">
            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-serif gold-soft-text">連絡先情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 gold-soft-text" />
                  <span className="text-muted-foreground">contact@devcatalyst.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 gold-soft-text" />
                  <span className="text-muted-foreground">03-1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 gold-soft-text" />
                  <span className="text-muted-foreground">東京都渋谷区</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-serif gold-soft-text">営業時間</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <p>平日: 9:00 - 18:00</p>
                  <p>土日祝: 休業</p>
                  <p className="text-sm gold-soft-text/70">※24時間AIサポートは常時稼働</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 法的情報セクション */}
        <div className="mt-20 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-4 gold-soft-text">法的情報・規約</h2>
            <p className="text-muted-foreground">
              devCatalist〈Vertex〉の利用規約、プライバシーポリシー、法的責任について
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 利用規約 */}
            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md hover:border-gold/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-serif gold-soft-text flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  利用規約
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• サービス利用に関する基本条件</p>
                  <p>• ユーザーの責任と義務</p>
                  <p>• 禁止事項と制限事項</p>
                  <p>• サービス内容の変更・終了</p>
                  <p>• 知的財産権の取り扱い</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full gold-soft-outline text-aria-dark-soft hover:bg-[rgba(249,233,201,0.12)] transition-colors"
                >
                  詳細を確認
                </Button>
              </CardContent>
            </Card>

            {/* プライバシーポリシー */}
            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md hover:border-gold/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-serif gold-soft-text flex items-center">
                  <Shield className="w-6 h-6 mr-3" />
                  プライバシーポリシー
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• 個人情報の収集・利用目的</p>
                  <p>• データの保存・管理方法</p>
                  <p>• 第三者への提供について</p>
                  <p>• ユーザーの権利と選択肢</p>
                  <p>• セキュリティ対策</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full gold-soft-outline text-aria-dark-soft hover:bg-[rgba(249,233,201,0.12)] transition-colors"
                >
                  詳細を確認
                </Button>
              </CardContent>
            </Card>

            {/* AI利用規約 */}
            <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md hover:border-gold/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-serif gold-soft-text flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  AI利用規約
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• AI生成内容の利用制限</p>
                  <p>• 責任の所在と免責事項</p>
                  <p>• データの学習利用について</p>
                  <p>• 不適切な利用の禁止</p>
                  <p>• 技術的制限と保証</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full gold-soft-outline text-aria-dark-soft hover:bg-[rgba(249,233,201,0.12)] transition-colors"
                >
                  詳細を確認
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 重要な免責事項 */}
          <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-serif gold-soft-text flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                重要な免責事項
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground">
                <div className="gold-soft-tint border border-gold/20 rounded-lg p-4">
                  <h4 className="font-semibold gold-soft-text mb-2">AI生成内容について</h4>
                  <p className="text-sm">
                    devCatalist〈Vertex〉が生成する戦略提案、分析結果、アドバイスは参考情報であり、
                    最終的な意思決定はユーザー自身の責任で行ってください。
                    AIの判断をそのまま採用することによる損失について、当社は一切の責任を負いません。
                  </p>
                </div>

                <div className="gold-soft-tint border border-gold/20 rounded-lg p-4">
                  <h4 className="font-semibold gold-soft-text mb-2">データの正確性</h4>
                  <p className="text-sm">
                    市場データ、競合分析、予測結果等の情報は、利用可能なデータに基づく推測であり、
                    100%の正確性を保証するものではありません。
                    重要な意思決定の前には、必ず追加の調査・検証を行ってください。
                  </p>
                </div>

                <div className="gold-soft-tint border border-gold/20 rounded-lg p-4">
                  <h4 className="font-semibold gold-soft-text mb-2">サービス利用の制限</h4>
                  <p className="text-sm">
                    本サービスは戦略立案支援ツールであり、投資助言、法律相談、税務相談等の
                    専門的なサービスではありません。
                    該当する分野での意思決定には、必ず専門家にご相談ください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* お問い合わせ先 */}
          <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-serif gold-soft-text">法的お問い合わせ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold gold-soft-text mb-2">一般のお問い合わせ</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    サービス利用、技術的な問題、料金について
                  </p>
                  <p className="gold-soft-text">support@devcatalyst.com</p>
                </div>
                <div>
                  <h4 className="font-semibold gold-soft-text mb-2">法的・コンプライアンス</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    利用規約、プライバシー、法的責任について
                  </p>
                  <p className="gold-soft-text">legal@devcatalyst.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
