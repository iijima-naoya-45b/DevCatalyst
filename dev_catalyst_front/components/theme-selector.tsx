"use client"

import * as React from "react"
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { value: "light", label: "ライトモード", icon: Sun },
    { value: "dark", label: "ダークモード", icon: Moon },
    { value: "system", label: "システム設定", icon: Monitor },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  if (!mounted) {
    return (
      <div className="relative">
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-navy-deepest/20 bg-white/10 hover:bg-white/20 text-navy-deepest dark:border-gold/20 dark:bg-gold/10 dark:hover:bg-gold/20 dark:text-gold backdrop-blur-sm">
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">ライトモード</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-foreground/20 bg-background/80 hover:bg-accent text-foreground backdrop-blur-sm shadow-sm"
      >
        <currentTheme.icon className="h-4 w-4" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card/95 backdrop-blur-sm shadow-lg z-20">
            <div className="py-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-accent ${theme === themeOption.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-card-foreground'
                    }`}
                >
                  <themeOption.icon className="h-4 w-4" />
                  <span>{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}