'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { formatLocation, cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface SlotTooltipProps {
    product: Product
    isActive?: boolean
}

export function SlotTooltip({ product, isActive = false }: SlotTooltipProps) {
    return (
        <>
            {/* Tooltip - Below on mobile, Above on desktop */}
            <div
                className={cn(
                    'absolute top-full md:bottom-full md:top-auto left-1/2 -translate-x-1/2 mt-2 md:mt-0 md:mb-2 z-50 transition-opacity duration-200',
                    'pointer-events-none opacity-0 group-hover:opacity-100',
                    isActive && 'opacity-100 pointer-events-auto'
                )}
            >
                <div className="glass-card p-3 max-w-xs shadow-2xl whitespace-nowrap">
                    {/* Product Image */}
                    {product.image_url && (
                        <div className="relative w-24 h-24 mb-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 mx-auto">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}

                    {/* Product Name */}
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1 text-sm text-center">
                        {product.name}
                    </h4>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-primary-500 flex-shrink-0" />
                        <span>{formatLocation(product.box_no, product.row_no, product.slot_no)}</span>
                    </div>
                </div>

                {/* Arrow - Top on mobile, Bottom on desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 md:top-auto md:-bottom-1 w-3 h-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rotate-45 border-l border-t md:border-l-0 md:border-t-0 md:border-r md:border-b border-white/30 dark:border-slate-700/60" />
            </div>
        </>
    )
}
