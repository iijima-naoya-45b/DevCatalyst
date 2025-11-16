'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Brain, LayoutDashboard, FileText, Target, BarChart3, Menu, Shield, Mail, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeToggleSwitch } from "@/components/theme-toggle-switch";
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setAuthenticated(isAuthenticated());
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    if (authenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleClickHome = () => {
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname?.startsWith('/dashboard/projects');
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 text-gray-900 dark:text-foreground border-gray-200/50 dark:border-gold/30 shadow-sm overflow-x-hidden">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-18">
        <div
          className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
          onClick={handleClickHome}
          aria-label="トップページへ戻る"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center gold-soft-gradient shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-aria-dark-soft transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold font-serif gold-soft-text transition-colors leading-tight">
              devCatalyst
            </h1>
            <span className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              AI Strategy Partner
            </span>
          </div>
        </div>
        <nav className="flex space-x-4 items-center">
          {authenticated ? (
            <>
              {/* デスクトップナビゲーション */}
              <ul className="hidden md:flex items-center space-x-1">
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/dashboard')
                        ? 'bg-gold/10 shadow-sm border border-gold/20 text-slate-900 dark:text-amber-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>ダッシュボード</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/specs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/specs')
                        ? 'bg-gold/10 shadow-sm border border-gold/20 text-slate-900 dark:text-amber-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Spec</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400 transition-all duration-200"
                  >
                    <Target className="h-4 w-4" />
                    <span>アクションプラン</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400 transition-all duration-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>分析</span>
                  </button>
                </li>
              </ul>
              {/* モバイルメニュー */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96">
                  <SheetHeader>
                    <SheetTitle>メニュー</SheetTitle>
                    <SheetDescription className="sr-only">
                      ナビゲーションメニュー
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      ダッシュボード
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/specs');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Spec
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      アクションプラン
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      分析
                    </Button>
                    {/* テーマトグル */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <div className="flex items-center justify-between px-2 py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">テーマ</span>
                        <ThemeToggleSwitch size="sm" />
                      </div>
                    </div>
                    {/* ユーザーアバター（モバイル・アイコンのみ） */}
                    {user && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 flex items-center px-2">
                        <Avatar className="h-10 w-10 border-2 border-gold/50">
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                          <AvatarFallback className="bg-gold/20 gold-soft-text-enhanced">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
              {/* ユーザーアバター（デスクトップ・アイコンのみ） */}
              {authenticated && user && (
                <div className="hidden sm:flex items-center px-2 py-1.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 ml-4 hover:shadow-md transition-all duration-200">
                  <Avatar className="h-9 w-9 border-2 border-gold/40 shadow-sm">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="bg-gold/20 gold-soft-text-enhanced text-sm font-semibold">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </>
          ) : (
            <>
              {/* デスクトップナビゲーション */}
              <ul className="hidden md:flex items-center space-x-1">
                <li>
                  <button
                    onClick={() => router.push('/')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === '/'
                        ? 'bg-gold/10 shadow-sm border border-gold/20 text-slate-900 dark:text-amber-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400'
                    }`}
                  >
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/privacy')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname?.startsWith('/privacy')
                        ? 'bg-gold/10 shadow-sm border border-gold/20 text-slate-900 dark:text-amber-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>プライバシーポリシー</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/contact')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname?.startsWith('/contact')
                        ? 'bg-gold/10 shadow-sm border border-gold/20 text-slate-900 dark:text-amber-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gold-600 dark:hover:text-gold-400'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>お問い合わせ</span>
                  </button>
                </li>
              </ul>
              {/* モバイルメニュー */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96">
                  <SheetHeader>
                    <SheetTitle>メニュー</SheetTitle>
                    <SheetDescription className="sr-only">
                      ナビゲーションメニュー
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Home
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/privacy');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      プライバシーポリシー
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/contact');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      お問い合わせ
                    </Button>
                    {/* テーマトグル */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <div className="flex items-center justify-between px-2 py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">テーマ</span>
                        <ThemeToggleSwitch size="sm" />
                      </div>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}
          <div className="flex items-center gap-3">
            <div className="hidden md:block lg:hidden">
              <ThemeToggle />
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggleAnimated />
              <div className="ml-2">
                <Button
                  onClick={handleGetStarted}
                  className="aria-gold-surface text-aria-dark-soft hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.55)] transition-all duration-300 font-semibold px-5"
                >
                  {isClient && authenticated ? 'ダッシュボード' : '始める'}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
