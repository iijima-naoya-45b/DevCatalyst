'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    LogOut, 
    Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

export function DashboardHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (err) {
            router.push('/login');
        }
    };

    if (!user) return null;

    return (
        <header className="relative z-10 p-4 bg-gradient-to-r from-purple-50/60 via-pink-50/50 to-rose-50/60 text-slate-800 border-b border-purple-100/50 shadow-lg dark:bg-black/80 dark:text-foreground dark:border-blue-900/30 glass-effect backdrop-blur-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div 
                        className="aria-icon-container w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-lg dark:bg-gold cursor-pointer animate-aria-float animate-aria-glow hover:scale-110 transition-all duration-300"
                        onClick={() => router.push('/dashboard')}
                    >
                        <Brain className="w-6 h-6 text-white dark:text-navy-main animate-aria-pulse" />
                    </div>
                    <h1 
                        className="text-lg font-bold font-serif text-dark-enhanced dark:text-gold cursor-pointer"
                        onClick={() => router.push('/dashboard')}
                    >
                        devCatalyst
                    </h1>
                </div>

                <nav className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-effect">
                        <Avatar className="h-8 w-8 border-2 border-gold/50">
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                            <AvatarFallback className="bg-gold/20 text-gold-enhanced">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{user.name}</span>
                    </div>

                    <ThemeToggle />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-slate-700 hover:text-gold-enhanced dark:text-gray-300 dark:hover:text-gold hover:bg-gold/10"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        ログアウト
                    </Button>
                </nav>
            </div>
        </header>
    );
}

