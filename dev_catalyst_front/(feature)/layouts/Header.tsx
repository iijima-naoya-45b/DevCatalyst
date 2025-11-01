import { Brain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeToggleSwitch } from "@/components/theme-toggle-switch";
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated";
import { ThemeSelector } from "@/components/theme-selector";

export function Header() {
  return (
    <header className="p-4 bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end text-slate-800 border-b border-slate-300 shadow-lg dark:bg-navy-main dark:text-foreground dark:border-gold/30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-lg dark:bg-gold">
            <Brain className="w-6 h-6 text-white dark:text-navy-main" />
          </div>
          <h1 className="text-lg font-bold font-serif text-dark-enhanced">devCatalyst</h1>
        </div>
        <nav className="flex space-x-4 items-center">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline text-enhanced hover:text-gold-enhanced">Home</a></li>
            <li><a href="#" className="hover:underline text-enhanced hover:text-gold-enhanced">About</a></li>
            <li><a href="#" className="hover:underline text-enhanced hover:text-gold-enhanced">Contact</a></li>
          </ul>
          <div className="flex items-center gap-3">
            {/* モバイル: シンプルなトグルスイッチ */}
            <div className="sm:hidden">
              <ThemeToggleSwitch size="sm" />
            </div>
            {/* タブレット: 中サイズのアニメーション付きトグル */}
            <div className="hidden sm:block lg:hidden">
              <ThemeToggle />
            </div>
            {/* デスクトップ: アニメーション付きトグル + セレクター */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggleAnimated />
              <div className="ml-2">
                <ThemeSelector />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
