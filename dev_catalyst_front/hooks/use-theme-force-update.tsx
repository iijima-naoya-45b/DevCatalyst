"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeForceUpdate() {
    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && resolvedTheme) {
            // DOM要素に直接クラスを適用して確実に反映
            const html = document.documentElement

            // 既存のテーマクラスをクリア
            html.classList.remove('dark', 'light')

            // 新しいテーマクラスを適用
            if (resolvedTheme === 'dark') {
                html.classList.add('dark')
            } else {
                html.classList.add('light')
            }

            // 強制的にスタイルを再計算
            html.style.colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light'

            // bodyのスタイルを統一
            const body = document.body

            if (resolvedTheme === 'dark') {
                body.style.cssText = 'background-color: #000000 !important; color: #ffffff !important; min-height: 100vh; transition: background-color 0.3s ease, color 0.3s ease;'
            } else {
                body.style.cssText = 'background-color: #f8fafc !important; color: #0f172a !important; min-height: 100vh; transition: background-color 0.3s ease, color 0.3s ease;'
            }
        }
    }, [theme, resolvedTheme, mounted])

    // currentThemeの更新
    useEffect(() => {
        if (mounted) {
            setCurrentTheme(resolvedTheme)
        }
    }, [resolvedTheme, mounted])

    return { mounted, currentTheme }
}