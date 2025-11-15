import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Lightbulb, Target, Map, TrendingUp, Settings, Menu, X, Home, GitBranch, Crown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { HeaderProps } from "./types";

export function Header({ currentView, onViewChange, showFlowDiagram, onToggleFlowDiagram, showPlanManagement, onTogglePlanManagement, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'ダッシュボード', icon: Home },
    { id: 'advisor', label: 'AI戦略分析', icon: Lightbulb },
    { id: 'target', label: 'ターゲット分析', icon: Target },
    { id: 'strategy', label: '戦略マップ', icon: Map },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  return (
    <header className="border-b border-border bg-navy-darker/95 backdrop-blur-md sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-18 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-10">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg group-hover:shadow-gold/25 transition-all duration-300">
                {/* Sailing Ship Icon with Particles */}
                <svg className="w-5 h-5 md:w-7 md:h-7 text-navy-deepest" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v2H3v-2zm6.5-14L12 2l2.5 2h-5zm2.5 2v8l6-2V6l-6 2zm0 0V6l-6 2v6l6-2z" />
                  <circle cx="18" cy="8" r="1" className="animate-pulse" fill="currentColor" opacity="0.7" />
                  <circle cx="6" cy="10" r="0.8" className="animate-pulse" fill="currentColor" opacity="0.5" style={{ animationDelay: '0.5s' }} />
                  <circle cx="20" cy="12" r="0.6" className="animate-pulse" fill="currentColor" opacity="0.6" style={{ animationDelay: '1s' }} />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-gold-light to-silver rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/10 to-transparent rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <h1 className="text-xl md:text-2xl font-serif font-semibold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent tracking-tight">
                devCatalist
              </h1>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-1 h-1 bg-gold rounded-full animate-pulse"></div>
                <span className="text-xs gold-soft-text/70 tracking-wide font-medium">革新の煌めきを、あなたのビジネスに</span>
                <div className="w-1 h-1 bg-gold rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = !showFlowDiagram && currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-3 px-4 py-2 transition-all duration-300 font-medium tracking-wide ${isActive
                      ? "bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-xl shadow-gold/20 border border-gold/30"
                      : "text-foreground/80 hover:bg-navy-medium/50 hover:gold-soft-text-light hover:shadow-lg border border-transparent hover:border-gold/10"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}

            {/* Flow Diagram Toggle */}
            {onToggleFlowDiagram && (
              <Button
                variant={showFlowDiagram ? "default" : "ghost"}
                onClick={onToggleFlowDiagram}
                className={`flex items-center space-x-3 px-4 py-2 transition-all duration-300 font-medium tracking-wide ${showFlowDiagram
                    ? "bg-gradient-to-r from-copper to-bronze text-navy-deepest hover:from-copper-light hover:to-bronze-light shadow-xl shadow-copper/20 border border-copper/30"
                    : "text-foreground/80 hover:bg-navy-medium/50 hover:text-copper-light hover:shadow-lg border border-transparent hover:border-copper/10"
                  }`}
              >
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">画面遷移図</span>
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <Menu className="w-5 h-5 gold-soft-text" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-navy-darker border-gold/20">
              <SheetHeader className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="gold-soft-text font-serif text-lg">ナビゲーション</SheetTitle>
                </div>
              </SheetHeader>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = !showFlowDiagram && currentView === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => {
                        onViewChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full justify-start space-x-3 h-12 transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-gold to-bronze text-navy-deepest"
                          : "text-foreground hover:bg-navy-medium hover:gold-soft-text-light"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}

                {/* Flow Diagram Toggle */}
                {onToggleFlowDiagram && (
                  <Button
                    variant={showFlowDiagram ? "default" : "ghost"}
                    onClick={() => {
                      onToggleFlowDiagram();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start space-x-3 h-12 transition-all duration-300 ${showFlowDiagram
                        ? "bg-gradient-to-r from-copper to-bronze text-navy-deepest"
                        : "text-foreground hover:bg-navy-medium hover:text-copper-light"
                      }`}
                  >
                    <GitBranch className="w-5 h-5" />
                    <span>画面遷移図</span>
                  </Button>
                )}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="border-t border-gold/20 pt-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="ring-2 ring-gold/40">
                      <AvatarImage src="/api/placeholder/32/32" />
                      <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest">TT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs gold-soft-text/70 uppercase tracking-wide">ソロプレナー</p>
                      <p className="text-sm text-foreground font-medium">田中 太郎</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop User Info */}
          <div className="text-right hidden lg:block space-y-1">
            <p className="text-xs gold-soft-text/70 tracking-wide font-medium uppercase">ソロプレナー</p>
            <p className="text-sm text-foreground font-medium tracking-wide">田中 太郎</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-1">
                <Avatar className="ring-2 ring-gold/40 shadow-lg hover:ring-gold/60 transition-all duration-300 w-8 h-8 md:w-10 md:h-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest font-semibold text-sm">TT</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-gold to-bronze rounded-full border-2 border-navy-darker flex items-center justify-center">
                  <div className="w-1 h-1 md:w-2 md:h-2 bg-navy-deepest rounded-full"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-navy-darker border-gold/20">
              <DropdownMenuItem className="focus:bg-navy-medium">
                <User className="w-4 h-4 mr-2" />
                <span>プロフィール設定</span>
              </DropdownMenuItem>
              {onTogglePlanManagement && (
                <DropdownMenuItem
                  onClick={onTogglePlanManagement}
                  className={`focus:bg-navy-medium transition-colors duration-200 ${showPlanManagement ? 'bg-gold/10 gold-soft-text' : 'hover:bg-navy-medium/70'}`}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  <span>プラン管理</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gold/20" />
              {onLogout && (
                <DropdownMenuItem
                  onClick={onLogout}
                  className="focus:bg-red-900/20 text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}