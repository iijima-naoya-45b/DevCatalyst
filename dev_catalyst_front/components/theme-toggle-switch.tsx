"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ThemeToggleSwitchProps } from "./types/theme"

export function ThemeToggleSwitch({
    size = "md",
    showLabels = false,
    className = ""
}: ThemeToggleSwitchProps) {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        if (resolvedTheme === "dark") {
            setTheme("light")
        } else {
            setTheme("dark")
        }
    }

    const isDark = resolvedTheme === "dark"

    // サイズ設定
    const sizeClasses = {
        sm: {
            container: "h-6 w-12",
            ball: "h-4 w-4",
            translate: isDark ? "translate-x-7" : "translate-x-1",
            icon: "h-2.5 w-2.5",
            padding: "px-1"
        },
        md: {
            container: "h-8 w-16",
            ball: "h-6 w-6",
            translate: isDark ? "translate-x-9" : "translate-x-1",
            icon: "h-3 w-3",
            padding: "px-1"
        },
        lg: {
            container: "h-10 w-20",
            ball: "h-8 w-8",
            translate: isDark ? "translate-x-11" : "translate-x-1",
            icon: "h-4 w-4",
            padding: "px-2"
        }
    }

    const currentSize = sizeClasses[size]

    if (!mounted) {
        return (
            <div className={`relative inline-flex ${currentSize.container} items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 ${className}`}>
                <div className={`absolute left-1 ${currentSize.ball} rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center`}>
                    <Sun className={`${currentSize.icon} gold-soft-text`} />
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {showLabels && (
                <span className={`text-sm font-medium transition-colors duration-300 ${!isDark ? 'gold-soft-text dark:gold-soft-text-light' : 'text-slate-400'}`}>
                    ライト
                </span>
            )}

            <button
                onClick={toggleTheme}
                className={`relative inline-flex ${currentSize.container} items-center rounded-full transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isDark
                    ? 'bg-gradient-to-r from-slate-700 to-slate-900 shadow-inner'
                    : 'bg-gradient-to-r from-gold/30 to-gold/45 shadow-sm'
                    }`}
                title={`${isDark ? 'ライト' : 'ダーク'}モードに切り替え`}
            >
                {/* スライドするボール */}
                <div
                    className={`absolute ${currentSize.ball} rounded-full bg-white shadow-lg transition-all duration-300 transform ${currentSize.translate} flex items-center justify-center ${isDark ? 'shadow-slate-900/20' : 'shadow-[rgba(243,200,106,0.35)]'
                        }`}
                >
                    {isDark ? (
                        <Moon className={`${currentSize.icon} text-slate-700`} />
                    ) : (
                        <Sun className={`${currentSize.icon} gold-soft-text`} />
                    )}
                </div>

                {/* 背景のアイコン（オプション） */}
                <div className={`absolute inset-0 flex items-center justify-between ${currentSize.padding}`}>
                    <Sun className={`${currentSize.icon} transition-opacity duration-300 ${!isDark ? 'opacity-0' : 'opacity-40 gold-soft-text-light'}`} />
                    <Moon className={`${currentSize.icon} transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40 text-slate-600'}`} />
                </div>
            </button>

            {showLabels && (
                <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>
                    ダーク
                </span>
            )}
        </div>
    )
}