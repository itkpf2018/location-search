'use client'

import React from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface SlotProps {
    boxNo: number
    rowNo: number
    slotNo: number
    product?: Product
    isHighlighted?: boolean
    onClick?: () => void
}

export function Slot({ boxNo, rowNo, slotNo, product, isHighlighted, onClick }: SlotProps) {
    const isEmpty = !product
    const isOccupied = !!product

    return (
        <div
            onClick={onClick}
            className={cn(
                'group relative w-full rounded-md md:rounded-lg transition-all duration-300 cursor-pointer overflow-hidden',
                'border flex flex-col items-center justify-center',
                'p-1 xs:p-1.5 sm:p-2 md:p-0',
                'aspect-[3/4] md:aspect-square',
                isEmpty && 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600',
                isOccupied && !isHighlighted && 'bg-white border-gray-200 md:border-gray-300 dark:bg-slate-800 dark:border-slate-700',
                isHighlighted && 'bg-gradient-to-br from-primary-500 to-primary-600 border-primary-700 shadow-2xl ring-4 ring-primary-400 ring-offset-2 scale-105',
            )}
        >
            {isOccupied && product && (
                <>
                    {product.image_url && (
                        <div
                            className={cn(
                                'absolute inset-0 transition-all duration-300',
                                'opacity-100',
                                'group-hover:scale-110'
                            )}
                        >
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(min-width: 768px) 25vw, 50vw"
                                className="object-contain md:object-cover"
                            />
                        </div>
                    )}

                    <div className="hidden md:block absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                    <div
                        className={cn(
                            'hidden md:flex',
                            'absolute bottom-0 left-0 right-0 z-10 p-3 flex-col',
                            isHighlighted ? 'text-white' : 'text-white'
                        )}
                    >
                        <Package className={cn('transition-all duration-300 mb-1', 'w-5 h-5')} />

                        <p className={cn('text-xs font-medium leading-tight line-clamp-2', 'text-white drop-shadow-lg')}>
                            {product.name}
                        </p>
                    </div>

                    <div
                        className={cn(
                            'hidden md:block absolute inset-0 rounded-md',
                            'ring-2 ring-primary-500 ring-opacity-0',
                            'group-hover:ring-opacity-100 transition-all duration-300',
                            isHighlighted && 'ring-opacity-100 ring-4'
                        )}
                    />

                    <div
                        className={cn(
                            'hidden md:block absolute inset-0 rounded-md',
                            'shadow-none group-hover:shadow-2xl transition-shadow duration-300',
                            isHighlighted && 'shadow-2xl'
                        )}
                    />
                </>
            )}

            {isEmpty && (
                <div className="text-gray-400 dark:text-slate-500 text-center flex flex-col items-center justify-center h-full">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 mb-1 rounded-full border border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                        <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 dark:text-slate-300">
                            {slotNo}
                        </span>
                    </div>
                    <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-gray-400 dark:text-slate-500 hidden xs:block">
                        ว่าง
                    </p>
                </div>
            )}
        </div>
    )
}
