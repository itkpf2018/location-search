'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme-mode'

export function ThemeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
    const [mode, setMode] = useState<ThemeMode>('light')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const id = window.setTimeout(() => {
            const stored = localStorage.getItem(STORAGE_KEY)
            const next =
                stored === 'light' || stored === 'dark'
                    ? stored
                    : window.matchMedia?.('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light'

            setMode(next)
            setIsReady(true)
        }, 0)

        return () => window.clearTimeout(id)
    }, [])

    useEffect(() => {
        if (!isReady) return
        document.documentElement.classList.toggle('dark', mode === 'dark')
        localStorage.setItem(STORAGE_KEY, mode)
    }, [mode, isReady])

    const toggle = () => {
        const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
        setMode(next)
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={mode === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            className={cn(
                'relative inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium',
                'bg-white/80 text-primary-700 border-primary-100 shadow-sm transition-all hover:shadow-md',
                'dark:bg-slate-900/70 dark:text-primary-200 dark:border-slate-700',
                className
            )}
        >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-slate-800 dark:text-primary-300">
                {mode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
            {!compact && <span>{mode === 'dark' ? 'Dark' : 'Light'}</span>}
        </button>
    )
}
