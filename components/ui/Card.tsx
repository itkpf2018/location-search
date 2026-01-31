import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    glass?: boolean
    hover?: boolean
    onClick?: () => void
}

export function Card({ children, className, glass = false, hover = false, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'rounded-xl p-6',
                glass
                    ? 'glass-card'
                    : 'bg-white border border-gray-200 shadow-md dark:bg-slate-900 dark:border-slate-700',
                hover && 'card-hover',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    )
}

interface CardTitleProps {
    children: React.ReactNode
    className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn('text-xl font-semibold text-gray-900 dark:text-slate-100', className)}>
            {children}
        </h3>
    )
}

interface CardContentProps {
    children: React.ReactNode
    className?: string
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('text-gray-600 dark:text-slate-300', className)}>
            {children}
        </div>
    )
}
