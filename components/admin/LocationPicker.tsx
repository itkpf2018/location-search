'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { useGridConfig } from '@/hooks/useGridConfig'
import { cn } from '@/lib/utils'

interface LocationPickerProps {
    boxNo: number
    rowNo: number
    slotNo: number
    onChange: (location: { box_no: number; row_no: number; slot_no: number }) => void
    occupiedSlots?: Array<{ box_no: number; row_no: number; slot_no: number }>
    currentProductId?: string
}

export function LocationPicker({
    boxNo,
    rowNo,
    slotNo,
    onChange,
    occupiedSlots = [],
}: LocationPickerProps) {
    const { config } = useGridConfig()

    const rowLabels = Array.from({ length: config.rowsPerBox }, (_, i) => i + 1)
    const slotLabels = Array.from({ length: config.slotsPerRow }, (_, i) => i + 1)

    const isSlotOccupied = (box: number, row: number, slot: number) => {
        return occupiedSlots.some(
            (s) => s.box_no === box && s.row_no === row && s.slot_no === slot
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Storage Location
                </label>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                        Box
                    </label>
                    <select
                        value={boxNo}
                        onChange={(e) =>
                            onChange({
                                box_no: Number(e.target.value),
                                row_no: rowNo,
                                slot_no: slotNo,
                            })
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 outline-none transition-all"
                    >
                        {Array.from({ length: config.boxes }, (_, i) => i + 1).map((box) => (
                            <option key={box} value={box}>
                                Box {box}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                        Row
                    </label>
                    <select
                        value={rowNo}
                        onChange={(e) =>
                            onChange({
                                box_no: boxNo,
                                row_no: Number(e.target.value),
                                slot_no: slotNo,
                            })
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 outline-none transition-all"
                    >
                        {rowLabels.map((row) => (
                            <option key={row} value={row}>
                                Row {row}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                        Slot
                    </label>
                    <select
                        value={slotNo}
                        onChange={(e) =>
                            onChange({
                                box_no: boxNo,
                                row_no: rowNo,
                                slot_no: Number(e.target.value),
                            })
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-900/40 outline-none transition-all"
                    >
                        {slotLabels.map((slot) => (
                            <option key={slot} value={slot}>
                                Slot {slot}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Visual Grid Picker */}
            <div className="glass-card p-4">
                <p className="text-xs font-medium text-gray-600 mb-3">
                    Visual Selector - Box {boxNo}
                </p>
                <div className="space-y-1">
                    {rowLabels.map((row) => (
                        <div key={row} className="flex gap-1">
                            {slotLabels.map((slot) => {
                                const isSelected = row === rowNo && slot === slotNo
                                const isOccupied = isSlotOccupied(boxNo, row, slot)

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => !isOccupied && onChange({ box_no: boxNo, row_no: row, slot_no: slot })}
                                        disabled={isOccupied}
                                        className={cn(
                                            'w-8 h-8 text-[10px] font-medium rounded transition-all',
                                            isSelected &&
                                                'bg-primary-500 text-white ring-2 ring-primary-600 ring-offset-2',
                                            !isSelected && !isOccupied && 'bg-gray-100 hover:bg-primary-100 text-gray-600',
                                            isOccupied && 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                        )}
                                        title={
                                            isOccupied
                                                ? 'Occupied'
                                                : `Box ${boxNo}, Row ${row}, Slot ${slot}`
                                        }
                                    >
                                        {slot}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Status */}
            {isSlotOccupied(boxNo, rowNo, slotNo) && (
                <p className="text-sm text-yellow-600">
                    ⚠️ This location is currently occupied
                </p>
            )}
        </div>
    )
}
