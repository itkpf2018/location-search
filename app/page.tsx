'use client'

import React, { useState, useEffect } from 'react'
import { Package, Settings } from 'lucide-react'
import Link from 'next/link'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { StorageGrid } from '@/components/grid/StorageGrid'
import { Loading } from '@/components/ui/Loading'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useGridConfig } from '@/hooks/useGridConfig'
import th from '@/lib/i18n/th'
import type { Product } from '@/lib/types'
import { apiFetch } from '@/lib/api-client'

export default function HomePage() {
    const { totalSlots } = useGridConfig()
    const [products, setProducts] = useState<Product[]>([])
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [highlightedProduct, setHighlightedProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

    // Fetch all products on mount
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await apiFetch('/api/products')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async (query: string, categoryId?: string | null) => {
        setSearchQuery(query)
        setSelectedCategoryId(categoryId || null)

        if (!query && !categoryId) {
            setSearchResults([])
            setHighlightedProduct(null)
            return
        }

        try {
            setIsSearching(true)
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (categoryId) params.set('category', categoryId)
            const response = await apiFetch(`/api/search?${params.toString()}`)
            const data = await response.json()
            setSearchResults(data.products || [])

            // Auto-highlight first result
            if (data.products && data.products.length > 0) {
                setHighlightedProduct(data.products[0])
            } else {
                setHighlightedProduct(null)
            }
        } catch (error) {
            console.error('Search failed:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectProduct = (product: Product) => {
        setHighlightedProduct(product)
    }

    const handleProductFound = (product: Product) => {
        setSearchQuery(product.name)
        setSearchResults([product])
        setHighlightedProduct(product)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-30 glass-card border-b border-white/30 dark:border-slate-800/60 hidden sm:block">
                <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex-shrink-0">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 truncate">
                                    {th.home.title}
                                </h1>
                                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-slate-300 hidden xs:block truncate">
                                    {th.home.subtitle}
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

            {/* Main Content */}
            <main className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto">
                    {/* Search Section */}
                    <div className="mb-6 sm:mb-8">
                        <SearchBar
                            onSearch={handleSearch}
                            onProductFound={handleProductFound}
                            isLoading={isSearching}
                        />
                        {(searchResults.length > 0 || searchQuery || selectedCategoryId) && (
                            <SearchResults
                                results={searchResults}
                                onSelectProduct={handleSelectProduct}
                                query={searchQuery}
                                isActive={!!searchQuery || !!selectedCategoryId}
                            />
                        )}
                    </div>

                    {/* Grid Section */}
                    <div>
                        <div className="mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100">
                                {th.home.storageLayout}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-1">
                                <span className="font-medium text-primary-600">{products.length}</span> {th.home.productsStored} {th.home.across} <span className="font-medium">{totalSlots}</span> {th.home.totalLocations}
                            </p>
                        </div>

                        <StorageGrid
                            products={products}
                            highlightedProduct={highlightedProduct}
                            onProductsUpdate={setProducts}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-8 sm:mt-12 md:mt-16 py-6 sm:py-8 border-t border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-3 xs:px-4 sm:px-6 text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <p>{th.footer.copyright}</p>
                </div>
            </footer>
        </div>
    )
}
