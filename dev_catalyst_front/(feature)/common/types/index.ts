export interface SettingsProps {
    onShowPlanManagement?: () => void;
}

export interface HeaderProps {
    currentView: string;
    onViewChange: (view: string) => void;
    showFlowDiagram?: boolean;
    onToggleFlowDiagram?: () => void;
    showPlanManagement?: boolean;
    onTogglePlanManagement?: () => void;
    onLogout?: () => void;
}

export interface AnalysisData {
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

export interface AnalysisResultsProps {
    data: AnalysisData;
    onClose: () => void;
}

export interface Message {
    id: string;
    type: 'user' | 'aria';
    content: string;
    timestamp: Date;
    suggestions?: string[];
    insights?: {
        type: 'strategy' | 'risk' | 'opportunity';
        title: string;
        description: string;
    }[];
    isStreaming?: boolean;
    displayedContent?: string;
    chartData?: any;
}

export interface AriaChatProps {
    onStartAnalysis?: () => void;
    showUserAvatar?: boolean;
}

export interface LandingPageProps {
    onStartTrial: () => void;
    onShowDemo: () => void;
}

export interface ScreenFlowDiagramProps {
    currentView: string;
    onViewChange: (view: string) => void;
    onShowFlow: () => void;
}

export interface DashboardProps {
    onViewChange: (view: string) => void;
    isFirstLogin?: boolean;
}

export interface SocialProofProps {
    userCount: number;
    recentActions: string[];
    className?: string;
}

export interface ScarcityProps {
    limitedSpots?: number;
    timeLeft?: number;
    onAction: () => void;
    className?: string;
}

export interface AnchoringProps {
    originalPrice: number;
    currentPrice: number;
    savingPercentage: number;
    onSelect: () => void;
    className?: string;
}

export interface LossAversionProps {
    missedOpportunities: string[];
    onPrevent: () => void;
    className?: string;
}

export interface AuthorityProps {
    expertName: string;
    credentials: string[];
    recommendation: string;
    avatar?: string;
    className?: string;
}

export interface EndowmentEffectProps {
    currentProgress: number;
    nextMilestone: string;
    onContinue: () => void;
    className?: string;
}

export interface FreshStartProps {
    opportunity: string;
    timeframe: string;
    onStart: () => void;
    className?: string;
}

