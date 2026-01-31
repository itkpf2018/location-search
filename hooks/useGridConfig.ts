'use client'

import { useEffect, useMemo, useState } from 'react'
import { GRID_CONFIG, GRID_LIMITS } from '@/lib/constants'

export type GridConfig = {
    boxes: number
    rowsPerBox: number
    slotsPerRow: number
}

const STORAGE_KEY = 'grid-config'

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.round(value)))

const normalize = (config: GridConfig): GridConfig => ({
    boxes: clamp(config.boxes, GRID_LIMITS.BOXES.MIN, GRID_LIMITS.BOXES.MAX),
    rowsPerBox: clamp(config.rowsPerBox, GRID_LIMITS.ROWS_PER_BOX.MIN, GRID_LIMITS.ROWS_PER_BOX.MAX),
    slotsPerRow: clamp(config.slotsPerRow, GRID_LIMITS.SLOTS_PER_ROW.MIN, GRID_LIMITS.SLOTS_PER_ROW.MAX),
})

const defaultConfig: GridConfig = {
    boxes: GRID_CONFIG.BOXES,
    rowsPerBox: GRID_CONFIG.ROWS_PER_BOX,
    slotsPerRow: GRID_CONFIG.SLOTS_PER_ROW,
}

const loadStoredConfig = (): GridConfig => {
    if (typeof window === 'undefined') return defaultConfig

    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return defaultConfig
        const parsed = JSON.parse(raw) as Partial<GridConfig>
        return normalize({
            boxes: parsed.boxes ?? defaultConfig.boxes,
            rowsPerBox: parsed.rowsPerBox ?? defaultConfig.rowsPerBox,
            slotsPerRow: parsed.slotsPerRow ?? defaultConfig.slotsPerRow,
        })
    } catch {
        return defaultConfig
    }
}

export function useGridConfig() {
    const [config, setConfig] = useState<GridConfig>(() => loadStoredConfig())

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    }, [config])

    const updateConfig = (next: Partial<GridConfig>) => {
        setConfig((prev) =>
            normalize({
                boxes: next.boxes ?? prev.boxes,
                rowsPerBox: next.rowsPerBox ?? prev.rowsPerBox,
                slotsPerRow: next.slotsPerRow ?? prev.slotsPerRow,
            })
        )
    }

    const resetConfig = () => setConfig(defaultConfig)

    const totalSlots = useMemo(
        () => config.boxes * config.rowsPerBox * config.slotsPerRow,
        [config]
    )

    return { config, updateConfig, resetConfig, totalSlots }
}
