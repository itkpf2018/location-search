'use client'

import { useState, useCallback } from 'react'

export interface MoveHistoryItem {
    productId: string
    productName: string
    fromBox: number
    fromRow: number
    fromSlot: number
    toBox: number
    toRow: number
    toSlot: number
    timestamp: number
}

export function useUndoRedo() {
    const [history, setHistory] = useState<MoveHistoryItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(-1)

    const canUndo = currentIndex >= 0
    const canRedo = currentIndex < history.length - 1

    const addMove = useCallback((move: MoveHistoryItem) => {
        setHistory(prev => [...prev.slice(0, currentIndex + 1), move])
        setCurrentIndex(prev => prev + 1)
    }, [currentIndex])

    const undo = useCallback(() => {
        if (canUndo) {
            setCurrentIndex(prev => prev - 1)
            return history[currentIndex]
        }
        return null
    }, [canUndo, currentIndex, history])

    const redo = useCallback(() => {
        if (canRedo) {
            setCurrentIndex(prev => prev + 1)
            return history[currentIndex + 1]
        }
        return null
    }, [canRedo, currentIndex, history])

    const clear = useCallback(() => {
        setHistory([])
        setCurrentIndex(-1)
    }, [])

    return {
        history,
        currentIndex,
        canUndo,
        canRedo,
        addMove,
        undo,
        redo,
        clear
    }
}
