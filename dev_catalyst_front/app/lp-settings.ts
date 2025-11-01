import { Clock, TrendingUp, Target, Brain, Users, MessageSquare } from "lucide-react";

export const heroStats = [
    { value: "24/7", label: "いつでも、瞬時に応答。どんな迷いも、AIがリアルタイムで解析し、次の一手を提示します。", icon: Brain },
    { value: "深夜の参謀", label: "思考が煮詰まる夜に。AIが仮説を整理し、静かに思考の流れを整えます。", icon: MessageSquare },
    { value: "本質に迫る", label: "問題の構造を可視化し、「刺さる理由」と「進む根拠」を一枚の思考地図に描き出します。", icon: Target },
    { value: "判断に寄り添う", label: "迷いや感情をもデータとして捉え、確信をもって進める意思決定へ導きます。", icon: Clock }
];

export const heroCheckpoints = [
    {
        title: "市場・競合視点の本質抽出",
        description: "膨大な仮説や思い込みを論理的に分解。市場・競合・顧客の構造を明確化し、打ち手とリスクを整理します。"
    },
    {
        title: "一歩踏み出す実行戦略",
        description: "複雑な意思決定プロセスをシンプルに。行動案を可視化し、次の一手を最速で提示します。"
    },
    {
        title: "迷い・不安の排除",
        description: "判断材料をAIが即座に整理。不確実な状況でも、戦略的な選択肢を提案します。"
    }
];

export const mainFeatures = [
    {
        id: 'ideation',
        title: '戦略の核抽出',
        subtitle: 'Core Extraction',
        description: '未だ言語化されていない思考を、強制的に形ある戦略へと昇華させる。対話のたび、あなたの軸は鋭利な輪郭を得る。',
        icon: Brain,
        color: 'from-gold to-bronze',
        demo: '「こんなサービス、どうかな...」\n→「いいですね。誰のための、どんな課題を？」\n→「なるほど。では、もう少し掘り下げてみましょう」',
        benefits: ['本質的な洞察の獲得', '市場に響く独自の回答', '実行プロセスの確定']
    },
    {
        id: 'competitive',
        title: '頂点への戦略分析',
        subtitle: 'Vertex Analysis',
        description: '市場の闇をデータで貫き、次に打つべき一手を明確に断言する。迷いを断ち、勝利への最短ルートを可視化する。',
        icon: Target,
        color: 'from-bronze to-copper',
        demo: '「競合が気になって...」\n→「では、まず現状を整理してみましょう」\n→「あなたらしい強みは、ここにありますね」',
        benefits: ['競争優位性の絶対確立', '市場を獲る一点突破戦略', 'リスクを排除した最良の選択']
    },
    {
        id: 'planning',
        title: '迷いなき行動計画',
        subtitle: 'Decisive Action Plan',
        description: '限られた夜の時を、勝利のための集中時間に変える。曖昧な目標を、迷うことなく実行可能な、最初の「一歩」へ強制的に転換する。',
        icon: TrendingUp,
        color: 'from-copper to-gold',
        demo: '「計画、どう立てよう...」\n→「まず、理想の形から話してみませんか？」\n→「そこから、できることを一緒に考えましょう」',
        benefits: ['成果を約束する確実な計画', '行動を妨げる不安の完全排除', '止まらない推進力の獲得']
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
        description: 'Vertexに、あなたのことを教えてください',
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
        id: 'standard',
        name: 'STANDARD',
        price: '¥2,480',
        period: '月額',
        description: '「静かな対話」を求めるすべてのソロプレナーへ。競合AIツールのベースラインより低価格で、心理的な壁を突破。',
        features: [
            'Vertexとの対話（無制限）',
            '思考の整理と分析',
            '基本的な市場分析',
            '計画づくりのサポート',
            '夜でも安心のメールサポート',
            '思考の記録をエクスポート'
        ],
        cta: '14日間、無料で試す',
        popular: true
    },
    {
        id: 'premium',
        name: 'PREMIUM',
        price: '¥4,980',
        period: '月額',
        description: '「本格的な戦略立案」を求める層へ。主要LLMの高機能プラン（Copilot for BusinessやClaude Proなど）と競合する価格帯とし、付加価値で勝負。',
        features: [
            'Vertexとの対話（無制限）',
            '高度な戦略分析とレポート',
            '詳細な市場分析と競合調査',
            '個別カスタマイズされた計画',
            'あなた専用の分析ダッシュボード',
            '優先サポート（24時間以内）',
            '思考の記録とデータ分析',
            '月次戦略レビューセッション'
        ],
        cta: '14日間、無料で試す',
        popular: false
    }
];
