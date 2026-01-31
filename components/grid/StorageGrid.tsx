'use client'

import React from 'react'
import { DraggableGrid } from './DraggableGrid'
import type { Product } from '@/lib/types'
import { useGridConfig } from '@/hooks/useGridConfig'

interface StorageGridProps {
    products: Product[]
    highlightedProduct?: Product | null
    onProductsUpdate: (products: Product[]) => void
    onRequestModal?: (product: Product) => void
}

export function StorageGrid({ products, highlightedProduct, onProductsUpdate, onRequestModal }: StorageGridProps) {
    const { config } = useGridConfig()
    // We pass the FULL products list to DraggableGrid because it filters internally by boxNo
    // This allows it to manage state updates correctly across the whole dataset if we ever support cross-box dragging

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {Array.from({ length: config.boxes }, (_, i) => {
                const boxNo = i + 1
                return (
                    <div
                        key={boxNo}
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <DraggableGrid
                            boxNo={boxNo}
                            rowsPerBox={config.rowsPerBox}
                            slotsPerRow={config.slotsPerRow}
                            products={products}
                            onProductsUpdate={onProductsUpdate}
                            highlightedProductId={highlightedProduct?.id}
                            onRequestModal={onRequestModal}
                        />
                    </div>
                )
            })}
        </div>
    )
}
