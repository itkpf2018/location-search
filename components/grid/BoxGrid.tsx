'use client'

import React, { useEffect, useRef } from 'react'
import { Slot } from './Slot'
import { SlotTooltip } from './SlotTooltip'
import { GRID_CONFIG } from '@/lib/constants'
import th from '@/lib/i18n/th'
import type { Product } from '@/lib/types'

interface BoxGridProps {
    boxNo: number
    products: Product[]
    highlightedProduct?: Product | null
}

export function BoxGrid({ boxNo, products, highlightedProduct }: BoxGridProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    const lastScrolledProductRef = useRef<string | null>(null)

    // Auto-scroll to highlighted product (only once per product)
    useEffect(() => {
        if (highlightedProduct && highlightedProduct.box_no === boxNo) {
            const productKey = `${highlightedProduct.id}-${highlightedProduct.box_no}-${highlightedProduct.row_no}-${highlightedProduct.slot_no}`

            // Only scroll if this is a different product than last time
            if (lastScrolledProductRef.current !== productKey) {
                const slotId = `slot-${boxNo}-${highlightedProduct.row_no}-${highlightedProduct.slot_no}`
                const slotElement = document.getElementById(slotId)

                if (slotElement) {
                    setTimeout(() => {
                        slotElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        })
                    }, 100)
                }

                lastScrolledProductRef.current = productKey
            }
        } else if (!highlightedProduct) {
            // Reset when search is cleared
            lastScrolledProductRef.current = null
        }
    }, [highlightedProduct, boxNo])

    // Create a map of products by location
    const productMap = new Map<string, Product>()
    products.forEach((product) => {
        const key = `${product.row_no}-${product.slot_no}`
        productMap.set(key, product)
    })

    return (
        <div ref={gridRef} className="glass-card p-3 xs:p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
            {/* Box Header */}
            <div className="mb-3 sm:mb-4 md:mb-5">
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900">
                    {th.grid.box} {boxNo}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    {products.length} สินค้า จาก {GRID_CONFIG.ROWS_PER_BOX * GRID_CONFIG.SLOTS_PER_ROW} ตำแหน่ง
                </p>
            </div>

            {/* Grid Container */}
            <div className="w-full">
                <div className="min-w-full">
                    {/* Column Headers */}
                    <div className="flex gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-2">
                        <div className="w-6 xs:w-8 sm:w-10 flex-shrink-0" /> {/* Row label space */}
                        <div className="flex-1 grid grid-cols-8 gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                            {Array.from({ length: GRID_CONFIG.SLOTS_PER_ROW }, (_, i) => (
                                <div
                                    key={i}
                                    className="text-center text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2">
                        {Array.from({ length: GRID_CONFIG.ROWS_PER_BOX }, (_, rowIndex) => {
                            const rowNo = rowIndex + 1

                            return (
                                <div
                                    key={rowNo}
                                    className="flex gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2"
                                >
                                    {/* Row Label */}
                                    <div className="w-6 xs:w-8 sm:w-10 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600">
                                            {rowNo}
                                        </span>
                                    </div>

                                    {/* Slots */}
                                    <div className="flex-1 grid grid-cols-8 gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                                        {Array.from({ length: GRID_CONFIG.SLOTS_PER_ROW }, (_, slotIndex) => {
                                            const slotNo = slotIndex + 1
                                            const key = `${rowNo}-${slotNo}`
                                            const product = productMap.get(key)
                                            const isHighlighted =
                                                highlightedProduct?.box_no === boxNo &&
                                                highlightedProduct?.row_no === rowNo &&
                                                highlightedProduct?.slot_no === slotNo

                                            return (
                                                <div
                                                    key={slotNo}
                                                    id={`slot-${boxNo}-${rowNo}-${slotNo}`}
                                                    className="relative group"
                                                >
                                                    <Slot
                                                        boxNo={boxNo}
                                                        rowNo={rowNo}
                                                        slotNo={slotNo}
                                                        product={product}
                                                        isHighlighted={isHighlighted}
                                                    />

                                                    {/* Tooltip on hover */}
                                                    {product && (
                                                        <SlotTooltip product={product} />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
