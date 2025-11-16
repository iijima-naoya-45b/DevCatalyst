import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  Users,
  Clock,
  Zap,
  Crown,
  Star,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Timer,
  UserCheck,
  Brain,
} from 'lucide-react';
import {
  SocialProofProps,
  ScarcityProps,
  AnchoringProps,
  LossAversionProps,
  AuthorityProps,
  EndowmentEffectProps,
  FreshStartProps,
} from './types';

// Social Proof Component (社会的証明)
export function SocialProof({ userCount, recentActions, className = '' }: SocialProofProps) {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActionIndex((prev) => (prev + 1) % recentActions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentActions.length]);

  return (
    <Card className={`border-bronze/20 bg-bronze/5 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-gold to-bronze rounded-full border-2 border-card flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-navy-deepest" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold text-bronze">
                {userCount.toLocaleString()}+ 人が利用中
              </div>
              <div className="text-xs text-muted-foreground animate-fade-in">
                {recentActions[currentActionIndex]}
              </div>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Scarcity Component (希少性)
export function Scarcity({ limitedSpots, timeLeft, onAction, className = '' }: ScarcityProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLeft || 0);

  useEffect(() => {
    if (timeLeft) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  return (
    <Card className={`border-orange-400/30 bg-orange-400/5 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span className="font-semibold text-orange-400">限定オファー</span>
        </div>

        {limitedSpots && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>残り枠数</span>
              <span className="font-bold text-orange-400">{limitedSpots}枠</span>
            </div>
            <Progress value={(20 - limitedSpots) * 5} className="h-2" />
          </div>
        )}

        {timeLeft && timeRemaining > 0 && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <Timer className="w-4 h-4 text-orange-400" />
              <span>
                あと{Math.floor(timeRemaining / 60)}時間{timeRemaining % 60}分で終了
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={onAction}
          className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600"
        >
          今すぐ始める
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Anchoring Component (アンカリング効果)
export function Anchoring({
  originalPrice,
  currentPrice,
  savingPercentage,
  onSelect,
  className = '',
}: AnchoringProps) {
  return (
    <Card className={`border-gold/30 bg-gold/5 backdrop-blur-sm relative ${className}`}>
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-gold to-bronze text-navy-deepest px-4 py-1">
          <Crown className="w-3 h-3 mr-1" />
          {savingPercentage}% OFF
        </Badge>
      </div>

      <CardContent className="p-6 pt-8">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-lg text-muted-foreground line-through">
              ¥{originalPrice.toLocaleString()}
            </div>
            <div className="text-3xl font-bold gold-soft-text">
              ¥{currentPrice.toLocaleString()}
            </div>
            <div className="text-sm text-green-400">
              年間 ¥{((originalPrice - currentPrice) * 12).toLocaleString()} お得
            </div>
          </div>

          <Button
            onClick={onSelect}
            className="w-full bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light"
          >
            この特別価格で始める
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Loss Aversion Component (損失回避)
export function LossAversion({
  missedOpportunities,
  onPrevent,
  className = '',
}: LossAversionProps) {
  return (
    <Card className={`border-red-400/30 bg-red-400/5 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span>見逃すリスク</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {missedOpportunities.map((opportunity, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-muted-foreground">{opportunity}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={onPrevent}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          機会損失を防ぐ
        </Button>
      </CardContent>
    </Card>
  );
}

// Authority Component (権威性)
export function Authority({
  expertName,
  credentials,
  recommendation,
  avatar,
  className = '',
}: AuthorityProps) {
  return (
    <Card className={`border-blue-400/30 bg-blue-400/5 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt={expertName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCheck className="w-6 h-6 text-white" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-semibold text-blue-400">{expertName}</h4>
              <div className="text-xs text-muted-foreground">{credentials.join(' • ')}</div>
            </div>

            <blockquote className="text-sm italic text-muted-foreground border-l-2 border-blue-400/30 pl-4">
              &quot;{recommendation}&quot;
            </blockquote>

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 gold-soft-text fill-current" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EndowmentEffect({
  currentProgress,
  nextMilestone,
  onContinue,
  className = '',
}: EndowmentEffectProps) {
  return (
    <Card className={`border-purple-400/30 bg-purple-400/5 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">あなたの進捗</span>
            <span className="text-sm text-purple-400">{currentProgress}%完了</span>
          </div>

          <Progress value={currentProgress} className="h-3" />

          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm">次のマイルストーン: {nextMilestone}</span>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            続きを進める
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            ここまでの進捗を失いたくありませんよね？
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FreshStart({ opportunity, timeframe, onStart, className = '' }: FreshStartProps) {
  const today = new Date();
  const isMonday = today.getDay() === 1;
  const isFirstOfMonth = today.getDate() === 1;
  const isNewYear = today.getMonth() === 0 && isFirstOfMonth;

  const getTimingMessage = () => {
    if (isNewYear) return '新年こそが新しいスタートの絶好のタイミング';
    if (isFirstOfMonth) return '月初めは新しい習慣を始める最適な時期';
    if (isMonday) return '月曜日は新しいことを始める理想的な日';
    return '今この瞬間が変化の始まり';
  };

  return (
    <Card className={`border-green-400/30 bg-green-400/5 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">新鮮スタート</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm">{getTimingMessage()}</p>
            <p className="text-lg font-semibold">{opportunity}</p>
            <p className="text-sm text-muted-foreground">{timeframe}で成果を実感</p>
          </div>

          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
          >
            <Brain className="w-4 h-4 mr-2" />
            今すぐ新しいスタートを切る
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
