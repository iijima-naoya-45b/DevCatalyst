'use client';

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeToggleSwitch } from "@/components/theme-toggle-switch";
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

  return (
    <header className="p-4 bg-white text-gray-900 border-b border-gray-200 shadow-sm dark:bg-slate-900 dark:text-foreground dark:border-gold/30">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          onClick={handleClickHome}
          aria-label="トップページへ戻る"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center gold-soft-gradient shadow-lg">
            <Brain className="w-6 h-6 text-aria-dark-soft" />
          </div>
          <h1 className="text-lg font-bold font-serif gold-soft-text transition-colors">
            devCatalyst
          </h1>
        </div>
        <nav className="flex space-x-4 items-center">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">Home</a></li>
            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">About</a></li>
            <li><a href="#" className="hover:underline text-gray-700 dark:text-gray-300 hover:gold-soft-text">Contact</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <div className="sm:hidden">
              <ThemeToggleSwitch size="sm" />
            </div>
            <div className="hidden sm:block lg:hidden">
              <ThemeToggle />
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggleAnimated />
              <div className="ml-2">
                <Button
                  onClick={handleGetStarted}
                  className="aria-gold-surface text-aria-dark-soft hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.55)] transition-all duration-300"
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
