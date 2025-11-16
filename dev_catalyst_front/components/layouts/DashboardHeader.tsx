'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Brain, LayoutDashboard, FileText, Target, BarChart3, Menu, Shield, Mail, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeToggleSwitch } from '@/components/theme-toggle-switch';
import { ThemeToggleAnimated } from '@/components/theme-toggle-animated';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        setAuthenticated(isAuthenticated());
    }, [isAuthenticated]);

    const handleLogout = async () => {
        router.push('/auth/logout');
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

    if (!mounted) {
        return (
            <header className="p-4 bg-white text-gray-900 border-b border-gray-200 shadow-sm dark:bg-slate-900 dark:text-foreground dark:border-gold/30">
                <div className="container mx-auto h-12 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 animate-pulse" />
                        <div className="h-4 w-24 bg-gold/20 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gold/20 animate-pulse" />
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 text-gray-900 dark:text-foreground border-gray-200/50 dark:border-gold/30 shadow-sm">
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
                            {/* モバイルメニューボタン */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                            <div className="hidden sm:flex items-center px-2 py-1.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-200">
                                <Avatar className="h-9 w-9 border-2 border-gold/40 shadow-sm">
                                    <AvatarImage src={user?.avatar_url} alt={user?.name} />
                                    <AvatarFallback className="bg-gold/20 gold-soft-text-enhanced text-sm font-semibold">
                                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </>
                    ) : (
                        <ul className="flex space-x-4">
                            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">Home</a></li>
                            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">About</a></li>
                            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">Contact</a></li>
                        </ul>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="sm:hidden">
                            <ThemeToggleSwitch size="sm" />
                        </div>
                        <div className="hidden sm:block lg:hidden">
                            <ThemeToggle />
                        </div>
                        <div className="hidden lg:flex items-center gap-2">
                            <ThemeToggleAnimated />
                            {authenticated && (
                                <div className="ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="text-slate-700 hover:gold-soft-text-enhanced dark:text-gray-300 dark:hover:gold-soft-text hover:bg-gold/10"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        ログアウト
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
            {/* モバイルメニュー */}
            {authenticated && mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 mt-2 pt-4">
                    <div className="container mx-auto space-y-2">
                        <button
                            onClick={() => {
                                router.push('/dashboard');
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                                isActive('/dashboard') ? 'gold-soft-text font-semibold bg-gold/10' : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            ダッシュボード
                        </button>
                        <button
                            onClick={() => {
                                router.push('/specs');
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                                isActive('/specs') ? 'gold-soft-text font-semibold bg-gold/10' : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <FileText className="h-4 w-4" />
                            Spec
                        </button>
                        <button
                            onClick={() => {
                                router.push('/dashboard');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <Target className="h-4 w-4" />
                            アクションプラン
                        </button>
                        <button
                            onClick={() => {
                                router.push('/dashboard');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <BarChart3 className="h-4 w-4" />
                            分析
                        </button>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                            >
                                <LogOut className="h-4 w-4" />
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

