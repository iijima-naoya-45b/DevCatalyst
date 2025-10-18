import { Clock, TrendingUp, Target, Brain, Users, MessageSquare } from "lucide-react";

export const heroStats = [
    { value: "24/7", label: "いつでも傍に", icon: Brain },
    { value: "深夜も", label: "静かに対話", icon: MessageSquare },
    { value: "澄む", label: "思考が澄んでいく", icon: Target },
    { value: "安心", label: "ひとりじゃない", icon: Clock }
];

export const mainFeatures = [
    {
        id: 'ideation',
        title: '思考の壁打ち',
        subtitle: 'Quiet Conversation',
        description: 'ぼんやりしたアイデアも、アリアと話すうちに形になっていく。言葉にするたび、輪郭がはっきりしていきます。',
        icon: Brain,
        color: 'from-gold to-bronze',
        demo: '「こんなサービス、どうかな...」\n→「いいですね。誰のための、どんな課題を？」\n→「なるほど。では、もう少し掘り下げてみましょう」',
        benefits: ['ゆっくり整理', 'やさしく深掘り', '気づきの発見', '実現への道筋']
    },
    {
        id: 'competitive',
        title: '静かな市場分析',
        subtitle: 'Thoughtful Insight',
        description: 'あなたの立ち位置を、データで優しく照らす。焦らず、じっくり、次の一手を見つけていきます。',
        icon: Target,
        color: 'from-bronze to-copper',
        demo: '「競合が気になって...」\n→「では、まず現状を整理してみましょう」\n→「あなたらしい強みは、ここにありますね」',
        benefits: ['自分の立ち位置', 'らしさの発見', '無理のない戦略', '安心の選択']
    },
    {
        id: 'planning',
        title: '夜の計画づくり',
        subtitle: 'Step by Step',
        description: '一人で考える夜も、アリアと話せば少しずつ道が見えてくる。焦らず、あなたのペースで。',
        icon: TrendingUp,
        color: 'from-copper to-gold',
        demo: '「計画、どう立てよう...」\n→「まず、理想の形から話してみませんか？」\n→「そこから、できることを一緒に考えましょう」',
        benefits: ['無理のない計画', '不安の整理', '小さな一歩', '続けられる道']
    }
];

export const onboardingSteps = [
    {
        step: 1,
        title: 'アカウント作成',
        description: '深夜でも、すぐに始められます',
        icon: Users,
        time: '30秒'
    },
    {
        step: 2,
        title: '簡単な自己紹介',
        description: 'アリアに、あなたのことを教えてください',
        icon: Users,
        time: '2分'
    },
    {
        step: 3,
        title: '最初の対話',
        description: '今、考えていることを話してみましょう',
        icon: MessageSquare,
        time: '3分'
    },
    {
        step: 4,
        title: '静かに、一緒に',
        description: 'あなたのペースで、思考を深めていく',
        icon: Brain,
        time: 'いつでも'
    }
];

export const plans = [
    {
        id: 'free',
        name: 'FREE',
        price: '¥0',
        period: '永続無料',
        description: 'まずは、アリアと話してみる',
        features: [
            'アリアとの対話（月5回まで）',
            '思考の整理（月3回まで）',
            '基本的な分析サポート',
            '夜でも安心のメールサポート',
            'いつでも気軽に相談'
        ],
        cta: '静かに始める',
        popular: false
    },
    {
        id: 'pro',
        name: 'PROFESSIONAL',
        price: '¥9,800',
        period: '月額',
        description: 'いつでも、何度でも、傍に',
        features: [
            'アリアといつでも対話（無制限）',
            'じっくり市場分析（無制限）',
            '計画づくりのサポート（無制限）',
            'あなた専用の分析ツール',
            '深夜も安心の優先サポート',
            '思考の記録をエクスポート'
        ],
        cta: '14日間、無料で試す',
        popular: true
    }
];
