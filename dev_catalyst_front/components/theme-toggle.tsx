"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // シンプルなライト/ダークのトグル
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  const isDark = resolvedTheme === "dark"

  if (!mounted) {
    return (
      <div className="relative inline-flex h-10 w-20 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300">
        <div className="absolute left-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-300">
          <Sun className="h-4 w-4 m-2 gold-soft-text" />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[0_0_20px_rgba(243,200,106,0.35)] dark:hover:shadow-slate-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-105"
      title={`${isDark ? 'ライト' : 'ダーク'}モードに切り替え`}
    >
      {/* トグルスイッチの背景 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 to-gold/40 dark:from-slate-600 dark:to-slate-800 transition-all duration-300" />

      {/* スライドするボール */}
      <div
        className={`absolute h-8 w-8 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform ${isDark ? 'translate-x-11' : 'translate-x-1'
          } flex items-center justify-center hover:scale-110`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-slate-700" />
        ) : (
          <Sun className="h-4 w-4 gold-soft-text" />
        )}
      </div>

      {/* 背景のアイコン */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={`h-4 w-4 transition-opacity duration-300 ${!isDark ? 'opacity-0' : 'opacity-60 gold-soft-text-light'}`} />
        <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-60 text-slate-500'}`} />
      </div>
    </button>
  )
}