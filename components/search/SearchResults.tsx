'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatLocation } from '@/lib/utils'
import th from '@/lib/i18n/th'
import type { Product } from '@/lib/types'

interface SearchResultsProps {
    results: Product[]
    onSelectProduct: (product: Product) => void
    query: string
    isActive?: boolean
}

export function SearchResults({ results, onSelectProduct, query, isActive }: SearchResultsProps) {
    if (!isActive && !query) return null

    if (results.length === 0) {
        return (
            <div className="mt-4 p-6 sm:p-8 text-center bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-700">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1 sm:mb-2">
                    {th.home.noResults}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                    {th.home.tryDifferentKeyword}
                </p>
            </div>
        )
    }

    return (
        <div className="mt-4 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-slate-100">
                    {th.home.searchResults}
                </h3>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                    {results.length} {th.common.search}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {results.map((product) => (
                    <Card
                        key={product.id}
                        hover
                        className="cursor-pointer group"
                        onClick={() => onSelectProduct(product)}
                    >
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 group-hover:border-primary-300 transition-colors">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-slate-100 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                                    {product.name}
                                </h4>

                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-primary-500" />
                                    <span className="font-medium">
                                        {formatLocation(product.box_no, product.row_no, product.slot_no)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
