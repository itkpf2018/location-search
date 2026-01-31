import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Loading({ size = 'md', className }: LoadingProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-4 border-gray-200 border-t-primary-500 dark:border-slate-700',
                    sizes[size]
                )}
            />
        </div>
    )
}

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="text-center">
                <Loading size="lg" />
                <p className="mt-4 text-lg font-medium text-gray-600 dark:text-slate-300">Loading...</p>
            </div>
        </div>
    )
}

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'animate-shimmer rounded-lg bg-gray-200 dark:bg-slate-800',
                className
            )}
        />
    )
}
