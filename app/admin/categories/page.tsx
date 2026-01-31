import Link from 'next/link'
import { Home, Tags } from 'lucide-react'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <header className="sticky top-0 z-30 glass-card border-b border-white/30 dark:border-slate-800/60 hidden sm:block">
                <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex-shrink-0">
                                <Tags className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 truncate">
                                    หมวดหมู่สินค้า
                                </h1>
                                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-slate-300 hidden xs:block truncate">
                                    จัดการหมวดหมู่และไอคอนสินค้า
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <ThemeToggle className="hidden xs:inline-flex" />
                            <nav className="hidden sm:flex items-center gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">หน้าแรก</span>
                                </Link>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">จัดการระบบ</span>
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">หมวดหมู่</span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 pb-20 sm:pb-24">
                <CategoryManager />
            </div>
        </div>
    )
}
