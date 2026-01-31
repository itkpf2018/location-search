'use client'

import { useMemo } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { GRID_LIMITS } from '@/lib/constants'
import { useGridConfig } from '@/hooks/useGridConfig'
import type { Product } from '@/lib/types'

interface GridConfigPanelProps {
    products: Product[]
}

export function GridConfigPanel({ products }: GridConfigPanelProps) {
    const { config, updateConfig, resetConfig, totalSlots } = useGridConfig()

    const outOfRangeCount = useMemo(() => {
        return products.filter(
            (p) =>
                p.box_no > config.boxes ||
                p.row_no > config.rowsPerBox ||
                p.slot_no > config.slotsPerRow
        ).length
    }, [products, config])

    const makeInputHandler =
        (key: 'boxes' | 'rowsPerBox' | 'slotsPerRow') =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = Number(e.target.value)
                if (!Number.isFinite(value)) return
                updateConfig({ [key]: value })
            }

    return (
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/30 dark:border-slate-700/60">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100">
                        ตั้งค่าขนาดบล็อค (ตัวอย่าง)
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                        ปรับจำนวนบล็อค / แถว / ช่อง ได้แบบทันที (ไม่บันทึกลงฐานข้อมูล)
                    </p>
                </div>
                <button
                    type="button"
                    onClick={resetConfig}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-100 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-medium">รีเซ็ต</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        key: 'boxes' as const,
                        label: 'จำนวนบล็อค',
                        min: GRID_LIMITS.BOXES.MIN,
                        max: GRID_LIMITS.BOXES.MAX,
                        value: config.boxes,
                    },
                    {
                        key: 'rowsPerBox' as const,
                        label: 'แถวต่อบล็อค',
                        min: GRID_LIMITS.ROWS_PER_BOX.MIN,
                        max: GRID_LIMITS.ROWS_PER_BOX.MAX,
                        value: config.rowsPerBox,
                    },
                    {
                        key: 'slotsPerRow' as const,
                        label: 'ช่องต่อแถว',
                        min: GRID_LIMITS.SLOTS_PER_ROW.MIN,
                        max: GRID_LIMITS.SLOTS_PER_ROW.MAX,
                        value: config.slotsPerRow,
                    },
                ].map((item) => (
                    <div
                        key={item.key}
                        className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                                {item.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                                {item.min}-{item.max}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => updateConfig({ [item.key]: item.value - 1 })}
                                className="h-9 w-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={item.min}
                                max={item.max}
                                value={item.value}
                                onChange={makeInputHandler(item.key)}
                                className="w-full h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-sm font-semibold text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => updateConfig({ [item.key]: item.value + 1 })}
                                className="h-9 w-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Plus className="w-4 h-4 mx-auto" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <span className="px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-300 border border-primary-100 dark:border-slate-700">
                    รวมทั้งหมด: {totalSlots} ช่อง
                </span>
                {outOfRangeCount > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                        มีสินค้า {outOfRangeCount} รายการอยู่นอกขอบเขตใหม่
                    </span>
                )}
            </div>
        </div>
    )
}
