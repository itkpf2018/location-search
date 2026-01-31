'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, Loader2, QrCode } from 'lucide-react'
import { QRCodeScanner } from '@/components/qr/QRCodeScanner'
import th from '@/lib/i18n/th'
import type { Product } from '@/lib/types'
import type { Category } from '@/lib/types-advanced'
import { DEMO_CATEGORIES } from '@/lib/demo-data'
import { apiFetch } from '@/lib/api-client'

interface SearchBarProps {
    onSearch: (query: string, categoryId?: string | null) => void
    onProductFound?: (product: Product) => void
    isLoading?: boolean
}

export function SearchBar({ onSearch, onProductFound, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [showQRScanner, setShowQRScanner] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [recent, setRecent] = useState<string[]>([])
    const [popular, setPopular] = useState<string[]>([])

    const RECENT_KEY = 'recent-searches'
    const POPULAR_KEY = 'popular-searches'

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await apiFetch('/api/categories')
                if (!response.ok) throw new Error('failed')
                const data = await response.json()
                setCategories(Array.isArray(data) ? data : DEMO_CATEGORIES)
            } catch {
                setCategories(DEMO_CATEGORIES)
            }
        }

        const loadHistory = () => {
            try {
                const recentRaw = localStorage.getItem(RECENT_KEY)
                const popularRaw = localStorage.getItem(POPULAR_KEY)
                setRecent(recentRaw ? JSON.parse(recentRaw) : [])
                setPopular(popularRaw ? JSON.parse(popularRaw) : [])
            } catch {
                setRecent([])
                setPopular([])
            }
        }

        loadCategories()
        loadHistory()
    }, [])

    const updateHistory = (value: string) => {
        if (!value) return

        const nextRecent = [value, ...recent.filter((q) => q !== value)].slice(0, 6)
        setRecent(nextRecent)
        localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent))

        let counts: Record<string, number> = {}
        try {
            counts = JSON.parse(localStorage.getItem(RECENT_KEY + '-counts') || '{}')
        } catch {
            counts = {}
        }
        counts[value] = (counts[value] || 0) + 1
        localStorage.setItem(RECENT_KEY + '-counts', JSON.stringify(counts))

        const popularSorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([term]) => term)
        setPopular(popularSorted)
        localStorage.setItem(POPULAR_KEY, JSON.stringify(popularSorted))
    }

    useEffect(() => {
        onSearch(debouncedQuery, selectedCategory)
        if (debouncedQuery) {
            updateHistory(debouncedQuery)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, selectedCategory])

    const handleClear = () => {
        setQuery('')
        setDebouncedQuery('')
    }

    const handleQRScan = (product: Product) => {
        setShowQRScanner(false)
        if (onProductFound) {
            onProductFound(product)
        } else {
            setQuery(product.name)
            setDebouncedQuery(product.name)
        }
    }

    const handleChipClick = (value: string) => {
        setQuery(value)
        setDebouncedQuery(value)
    }

    return (
        <>
            <div className="w-full sticky top-0 z-20 sm:static">
                <div className="rounded-2xl bg-white/95 dark:bg-slate-950/90 backdrop-blur border border-gray-200/80 dark:border-slate-800/80 px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 min-w-0">
                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-slate-400" />
                                )}
                            </div>

                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={th.home.searchPlaceholder}
                                className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4 text-sm sm:text-base
            bg-white border-2 border-gray-200 rounded-xl
            focus:border-primary-500 focus:ring-4 focus:ring-primary-100
            outline-none transition-all duration-200
            placeholder:text-gray-400
            dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 dark:placeholder:text-slate-500"
                            />

                            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center gap-1">
                                <button
                                    onClick={() => setShowQRScanner(true)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-400 dark:hover:text-primary-300 dark:hover:bg-slate-800 transition-colors"
                                    aria-label="Scan QR Code"
                                    title="สแกน QR Code"
                                >
                                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                {query && (
                                    <button
                                        onClick={handleClear}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                        aria-label={th.common.close}
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="w-28 xs:w-32 sm:w-64 px-3 py-3 sm:py-4 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-gray-700 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 outline-none"
                        >
                            <option value="">หมวดหมู่</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(recent.length > 0 || popular.length > 0) && (
                        <div className="mt-3 space-y-2">
                            {recent.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                                        คำค้นล่าสุด
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recent.map((item) => (
                                            <button
                                                key={`recent-${item}`}
                                                type="button"
                                                onClick={() => handleChipClick(item)}
                                                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-xs text-gray-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {popular.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                                        คำค้นยอดนิยม
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {popular.map((item) => (
                                            <button
                                                key={`popular-${item}`}
                                                type="button"
                                                onClick={() => handleChipClick(item)}
                                                className="px-3 py-1.5 rounded-full bg-primary-50 text-xs text-primary-700 hover:bg-primary-100 dark:bg-slate-800 dark:text-primary-300 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showQRScanner && (
                <QRCodeScanner
                    onScan={handleQRScan}
                    onClose={() => setShowQRScanner(false)}
                />
            )}
        </>
    )
}
