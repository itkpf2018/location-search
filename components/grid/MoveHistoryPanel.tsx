'use client'

import { useState, useEffect } from 'react'
import { History, X, Undo2 } from 'lucide-react'
import type { MoveHistory } from '@/lib/types-advanced'
import { apiFetch } from '@/lib/api-client'

interface MoveHistoryPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function MoveHistoryPanel({ isOpen, onClose }: MoveHistoryPanelProps) {
    const [history, setHistory] = useState<MoveHistory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchHistory()
        }
    }, [isOpen])

    const fetchHistory = async () => {
        try {
            const response = await apiFetch('/api/move-history?limit=50')
            const data = await response.json()
            setHistory(data)
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <History className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">ประวัติการย้าย</h3>
                            <p className="text-sm text-gray-600">50 รายการล่าสุด</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            กำลังโหลด...
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <Undo2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">ยังไม่มีประวัติการย้าย</p>
                        </div>
                    ) : (
                        history.map((move, index) => (
                            <div
                                key={move.id}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 mb-1">
                                            {move.product_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono">
                                                {move.from_box}-{move.from_row}-{move.from_slot}
                                            </span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-mono">
                                                {move.to_box}-{move.to_row}-{move.to_slot}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(move.moved_at).toLocaleString('th-TH', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
