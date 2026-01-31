'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Tags } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navItems = [
    { href: '/', label: 'หน้าแรก', icon: Home },
    { href: '/admin', label: 'จัดการสินค้า', icon: Settings },
    { href: '/admin/categories', label: 'หมวดหมู่', icon: Tags },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav id="mobile-bottom-nav" className="sm:hidden fixed bottom-0 inset-x-0 z-50 transition-transform duration-300">
            <div className="border-t border-primary-100 bg-white/95 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/95 pb-[env(safe-area-inset-bottom)]">
                <div className="grid grid-cols-4">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors',
                                    isActive ? 'text-white' : 'text-primary-600 dark:text-primary-300'
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex items-center justify-center w-9 h-9 rounded-xl transition-all',
                                        isActive
                                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-200'
                                            : 'bg-primary-50 dark:bg-slate-800'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                </span>
                                <span className={cn(isActive && 'text-primary-50')}>{label}</span>
                            </Link>
                        )
                    })}

                    <div className="flex flex-col items-center justify-center py-3 text-[11px] font-medium text-primary-600 dark:text-primary-300">
                        <ThemeToggle
                            compact
                            className="h-9 w-9 !px-0 !py-0 rounded-xl border border-primary-100 dark:border-slate-700 bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 justify-center"
                        />
                        <span className="mt-1">โหมด</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}
