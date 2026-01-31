import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full px-4 py-3 rounded-lg border-2 border-gray-200',
                            'focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
                            'outline-none transition-all duration-200 bg-white',
                            'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:border-primary-400 dark:focus:ring-primary-900/40',
                            'placeholder:text-gray-400',
                            'dark:placeholder:text-slate-500',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
