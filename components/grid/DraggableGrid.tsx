'use client'

import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Undo, Redo, History } from 'lucide-react'
import { Slot } from './Slot'
import th from '@/lib/i18n/th'
import type { Product } from '@/lib/types'
import type { MoveHistory } from '@/lib/types-advanced'
import { apiFetch } from '@/lib/api-client'

interface DraggableGridProps {
    boxNo: number
    rowsPerBox: number
    slotsPerRow: number
    products: Product[]
    onProductsUpdate: (products: Product[]) => void
    highlightedProductId?: string | null
    onRequestModal?: (product: Product) => void
}

export function DraggableGrid({
    boxNo,
    rowsPerBox,
    slotsPerRow,
    products,
    onProductsUpdate,
    highlightedProductId,
    onRequestModal,
}: DraggableGridProps) {
    const lastScrolledProductRef = useRef<string | null>(null)
    const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    const canUndo = historyIndex >= 0
    const canRedo = historyIndex < moveHistory.length - 1

    const recordMove = useCallback(async (
        productId: string,
        productName: string,
        fromBox: number,
        fromRow: number,
        fromSlot: number,
        toBox: number,
        toRow: number,
        toSlot: number
    ) => {
        try {
            await apiFetch('/api/move-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    product_name: productName,
                    from_box: fromBox,
                    from_row: fromRow,
                    from_slot: fromSlot,
                    to_box: toBox,
                    to_row: toRow,
                    to_slot: toSlot
                })
            })
        } catch (error) {
            console.error('Error recording move:', error)
        }
    }, [])

    const handleDragEnd = useCallback(async (result: DropResult) => {
        const { source, destination, draggableId } = result

        if (!destination) return
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return
        }

        // Parse IDs: format is "box-row-slot"
        const parseSlotId = (id: string) => {
            const [box, row, slot] = id.split('-').map(Number)
            return { box, row, slot }
        }

        const sourcePos = parseSlotId(source.droppableId)
        const destPos = parseSlotId(destination.droppableId)

        // Find the product being moved
        const product = products.find(p => p.id === draggableId)
        if (!product) return

        // Update product location via API
        try {
            const response = await apiFetch('/api/products/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.id,
                    to_box: destPos.box,
                    to_row: destPos.row,
                    to_slot: destPos.slot
                })
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'ไม่สามารถย้ายสินค้าได้')
                return
            }

            // Update local state
            const updatedProducts = products.map(p => {
                if (p.id === product.id) {
                    return {
                        ...p,
                        box_no: destPos.box,
                        row_no: destPos.row,
                        slot_no: destPos.slot
                    }
                }
                return p
            })

            onProductsUpdate(updatedProducts)

            // Record in history
            await recordMove(
                product.id,
                product.name,
                sourcePos.box,
                sourcePos.row,
                sourcePos.slot,
                destPos.box,
                destPos.row,
                destPos.slot
            )

            // Add to undo/redo history
            const newMove: MoveHistory = {
                id: Date.now().toString(),
                product_id: product.id,
                product_name: product.name,
                from_box: sourcePos.box,
                from_row: sourcePos.row,
                from_slot: sourcePos.slot,
                to_box: destPos.box,
                to_row: destPos.row,
                to_slot: destPos.slot,
                moved_at: new Date().toISOString()
            }

            setMoveHistory(prev => [...prev.slice(0, historyIndex + 1), newMove])
            setHistoryIndex(prev => prev + 1)

        } catch (error) {
            console.error('Error moving product:', error)
            alert('เกิดข้อผิดพลาดในการย้ายสินค้า')
        }
    }, [products, onProductsUpdate, recordMove, historyIndex])

    const undo = useCallback(async () => {
        if (!canUndo) return

        const move = moveHistory[historyIndex]
        const product = products.find(p => p.id === move.product_id)
        if (!product) return

        try {
            const response = await apiFetch('/api/products/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: move.product_id,
                    to_box: move.from_box,
                    to_row: move.from_row,
                    to_slot: move.from_slot
                })
            })

            if (response.ok) {
                const updatedProducts = products.map(p => {
                    if (p.id === move.product_id) {
                        return {
                            ...p,
                            box_no: move.from_box,
                            row_no: move.from_row,
                            slot_no: move.from_slot
                        }
                    }
                    return p
                })

                onProductsUpdate(updatedProducts)
                setHistoryIndex(prev => prev - 1)
            }
        } catch (error) {
            console.error('Error undoing move:', error)
        }
    }, [canUndo, moveHistory, historyIndex, products, onProductsUpdate])

    const redo = useCallback(async () => {
        if (!canRedo) return

        const move = moveHistory[historyIndex + 1]
        const product = products.find(p => p.id === move.product_id)
        if (!product) return

        try {
            const response = await apiFetch('/api/products/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: move.product_id,
                    to_box: move.to_box,
                    to_row: move.to_row,
                    to_slot: move.to_slot
                })
            })

            if (response.ok) {
                const updatedProducts = products.map(p => {
                    if (p.id === move.product_id) {
                        return {
                            ...p,
                            box_no: move.to_box,
                            row_no: move.to_row,
                            slot_no: move.to_slot
                        }
                    }
                    return p
                })

                onProductsUpdate(updatedProducts)
                setHistoryIndex(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error redoing move:', error)
        }
    }, [canRedo, moveHistory, historyIndex, products, onProductsUpdate])

    const productLookup = useMemo(() => {
        const map = new Map<string, Product>()
        products.forEach((p) => {
            if (p.box_no !== boxNo) return
            map.set(`${p.row_no}-${p.slot_no}`, p)
        })
        return map
    }, [products, boxNo])

    const boxProducts = useMemo(
        () => products.filter((p) => p.box_no === boxNo),
        [products, boxNo]
    )

    useEffect(() => {
        if (!highlightedProductId) {
            lastScrolledProductRef.current = null
            return
        }

        const target = products.find(p => p.id === highlightedProductId)
        if (!target || target.box_no !== boxNo) return

        const productKey = `${target.id}-${target.box_no}-${target.row_no}-${target.slot_no}`
        if (lastScrolledProductRef.current === productKey) return

        const slotId = `slot-${boxNo}-${target.row_no}-${target.slot_no}`
        const slotElement = document.getElementById(slotId)
        if (slotElement) {
            setTimeout(() => {
                slotElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
        }

        lastScrolledProductRef.current = productKey
    }, [highlightedProductId, products, boxNo])

    return (
        <div className="-mx-3 xs:-mx-4 sm:mx-0 glass-card p-3 xs:p-4 sm:p-5 md:p-6 rounded-none sm:rounded-2xl">
            {/* Box Header */}
            <div className="mb-3 sm:mb-4 md:mb-5">
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100">
                    {th.grid.box} {boxNo}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-0.5 sm:mt-1">
                    {boxProducts.length} {th.units.items} {th.home.across}{' '}
                    {rowsPerBox * slotsPerRow} {th.home.totalLocations}
                </p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2">
                    {/* Column Headers */}
                    <div className="flex gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-2">
                        <div className="w-6 xs:w-8 sm:w-10 flex-shrink-0" />
                        <div
                            className="flex-1 min-w-0 grid gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2"
                            style={{ gridTemplateColumns: `repeat(${slotsPerRow}, minmax(0, 1fr))` }}
                        >
                            {Array.from({ length: slotsPerRow }, (_, i) => (
                                <div
                                    key={i}
                                    className="text-center text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {Array.from({ length: rowsPerBox }, (_, rowIndex) => {
                        const rowNo = rowIndex + 1

                        return (
                            <div
                                key={rowNo}
                                className="flex gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2"
                            >
                                {/* Row Label */}
                                <div className="w-6 xs:w-8 sm:w-10 flex-shrink-0 flex items-center justify-center">
                                    <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300">
                                        {rowNo}
                                    </span>
                                </div>

                                {/* Slots */}
                                <div
                                    className="flex-1 min-w-0 grid gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2"
                                    style={{ gridTemplateColumns: `repeat(${slotsPerRow}, minmax(0, 1fr))` }}
                                >
                                    {Array.from({ length: slotsPerRow }, (_, slotIndex) => {
                                        const slotNo = slotIndex + 1
                                        const slotId = `${boxNo}-${rowNo}-${slotNo}`
                                        const product = productLookup.get(`${rowNo}-${slotNo}`)

                                        return (
                                        <Droppable key={slotId} droppableId={slotId}>
                                            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className="relative group"
                                                    id={`slot-${boxNo}-${rowNo}-${slotNo}`}
                                                >
                                                    {product ? (
                                                        <Draggable draggableId={product.id} index={slotIndex}>
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={snapshot.isDragging ? 'opacity-50 scale-105 z-50' : ''}
                                                            onClick={() => onRequestModal?.(product)}
                                                        >
                                                                    <Slot
                                                                        boxNo={boxNo}
                                                                        rowNo={rowNo}
                                                                        slotNo={slotNo}
                                                                        product={product}
                                                                        isHighlighted={product.id === highlightedProductId}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ) : (
                                                        <Slot
                                                            boxNo={boxNo}
                                                            rowNo={rowNo}
                                                            slotNo={slotNo}
                                                            product={undefined}
                                                            isHighlighted={false}
                                                        />
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    )
                                })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DragDropContext>

            {/* Undo/Redo Controls */}
            {moveHistory.length > 0 && (
                <div className="fixed bottom-6 right-6 flex gap-2 z-40">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className="btn-floating"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-5 h-5" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className="btn-floating"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            // Show history modal - to be implemented
                        }}
                        className="btn-floating"
                        title="View History"
                    >
                        <History className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    )
}
