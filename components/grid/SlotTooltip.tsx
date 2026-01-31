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
            <div
                className={cn(
                    'absolute top-full md:bottom-full md:top-auto left-1/2 -translate-x-1/2 mt-2 md:mt-0 md:mb-2 z-50 transition-all duration-200',
                    'pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100',
                    isActive && 'opacity-100 pointer-events-auto scale-100 translate-y-1'
                )}
            >
                <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-white to-blue-50 px-4 py-4 text-center shadow-[0_20px_60px_rgba(59,130,246,0.35)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_rgba(255,255,255,0))] opacity-80" />
                    <div className="relative space-y-3">
                        {product.image_url && (
                            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl bg-white/70 shadow-inner">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            </div>
                        )}
                        <h4 className="text-base font-semibold text-primary-900">
                            {product.name}
                        </h4>
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-primary-600">
                            <MapPin className="w-4 h-4" />
                            <span>{formatLocation(product.box_no, product.row_no, product.slot_no)}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 -top-1 md:top-auto md:-bottom-1 w-3 h-3 bg-white/80 backdrop-blur-lg rotate-45 border border-primary-200" />
            </div>
        </>
    )
}
