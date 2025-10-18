'use client';

import { useState } from "react";
import { Button } from "../../../(feature)/common/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "../../../(feature)/common/ui/card";
import { Progress } from "../../../(feature)/common/ui/progress";
import { Shield, Sparkles, Chrome, Github, CheckCircle } from "lucide-react";

interface AuthFlowProps {
  onComplete: () => void;
}

export default function AuthFlow({ onComplete }: AuthFlowProps) {
  const [authInProgress, setAuthInProgress] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleSocialAuth = (provider: "google" | "github") => {
    console.log(`Authenticating with ${provider}...`);
    setAuthInProgress(true);
    // Mock: simulate async OAuth
    setTimeout(() => {
      setAuthInProgress(false);
      setAuthenticated(true);
      // onComplete(); // simulate redirect or success callback
    }, 1000);
  };

  const steps = [
    { id: 'login', title: '認証', description: 'GoogleまたはGitHubでログイン' },
    { id: 'complete', title: '完了', description: 'セットアップ完了' }
  ];

  const getCurrentStepIndex = () => (authenticated ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deepest via-navy-darker to-navy-dark flex items-center justify-center p-4 relative">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-copper/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-bronze/4 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-navy-deepest" />
            </div>
            <h1 className="text-2xl font-serif font-semibold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
              devCatalist
            </h1>
          </div>
          <p className="text-muted-foreground">革新の煌めきを、あなたのビジネスに</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                    ${index <= getCurrentStepIndex()
                      ? 'bg-gradient-to-r from-gold to-bronze text-navy-deepest'
                      : 'bg-navy-medium border border-gold/20 text-muted-foreground'}
                  `}
                >
                  {index < getCurrentStepIndex() ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-16 h-0.5 mx-2 transition-all duration-300
                      ${index < getCurrentStepIndex() ? 'bg-gold' : 'bg-navy-medium'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress
            value={(getCurrentStepIndex() / (steps.length - 1)) * 100}
            className="h-2"
          />
        </div>

        {/* メインコンテンツ */}
        <Card className="border border-gold/25 bg-navy-dark/80 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-serif">ログイン</CardTitle>
            <CardDescription>Google または GitHubで認証してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleSocialAuth("google")}
              variant="outline"
              disabled={authInProgress}
              className="w-full h-12 border-gold/30 hover:border-gold hover:bg-gold/5 text-foreground"
            >
              <Chrome className="w-5 h-5 mr-3 text-gold" />
              {authInProgress ? "Googleで認証中..." : "Googleでログイン"}
            </Button>

            <Button
              onClick={() => handleSocialAuth("github")}
              variant="outline"
              disabled={authInProgress}
              className="w-full h-12 border-bronze/30 hover:border-bronze hover:bg-bronze/5 text-foreground"
            >
              <Github className="w-5 h-5 mr-3 text-bronze" />
              {authInProgress ? "GitHubで認証中..." : "GitHubでログイン"}
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>SSL暗号化により安全に保護されています</span>
          </div>
        </div>
      </div>
    </div>
  );
}
