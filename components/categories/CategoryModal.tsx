'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types-advanced'
import { apiFetch } from '@/lib/api-client'

interface CategoryModalProps {
    category?: Category | null
    onClose: () => void
    onSave: () => void
}

const ICON_OPTIONS = [
    'Package', 'Box', 'Wrench', 'Zap', 'Cpu', 'Cog', 'Settings',
    'Hammer', 'Drill', 'Bolt', 'Nut', 'Gauge', 'Cable',
    'Plug', 'Battery', 'CircuitBoard', 'Microchip', 'HardDrive',
    'Server', 'Database', 'Layers', 'Component', 'Puzzle'
]

export function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
    const [name, setName] = useState(category?.name || '')
    const [color, setColor] = useState(category?.color || '#3B82F6')
    const [selectedIcon, setSelectedIcon] = useState(category?.icon || 'Package')
    const [description, setDescription] = useState(category?.description || '')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        document.body.classList.add('modal-open')
        return () => document.body.classList.remove('modal-open')
    }, [])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setSaving(true)

        try {
            const url = category
                ? `/api/categories/${category.id}`
                : '/api/categories'

            const method = category ? 'PATCH' : 'POST'

            await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    color,
                    icon: selectedIcon,
                    description: description.trim() || null
                })
            })

            onSave()
        } catch (error) {
            console.error('Error saving category:', error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        {category ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input w-full"
                            placeholder="เช่น อะไหล่ไฟฟ้า"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            คำอธิบาย
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input w-full min-h-[80px] resize-none"
                            placeholder="คำอธิบายเพิ่มเติม (ถ้ามี)"
                        />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            สี
                        </label>
                        <div className="flex gap-4">
                            <HexColorPicker color={color} onChange={setColor} />
                            <div className="flex-1 space-y-2">
                                <div
                                    className="w-full h-24 rounded-lg border-2 border-gray-200"
                                    style={{ backgroundColor: color }}
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="input w-full font-mono text-sm"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Icon Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ไอคอน
                        </label>
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                            {ICON_OPTIONS.map(iconName => {
                                const IconComponent = (LucideIcons as any)[iconName]
                                if (!IconComponent) return null

                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setSelectedIcon(iconName)}
                                        className={cn(
                                            'p-3 rounded-lg border-2 transition-all hover:scale-110',
                                            selectedIcon === iconName
                                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        <IconComponent className="w-6 h-6 mx-auto" style={{
                                            color: selectedIcon === iconName ? color : '#6B7280'
                                        }} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-3">ตัวอย่าง</p>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white border-2 border-gray-200">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${color}20` }}
                            >
                                {(() => {
                                    const IconComponent = (LucideIcons as any)[selectedIcon]
                                    return <IconComponent className="w-5 h-5" style={{ color }} />
                                })()}
                            </div>
                            <span className="font-medium text-gray-900">
                                {name || 'ชื่อหมวดหมู่'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-colors"
                            disabled={saving}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-md disabled:opacity-50"
                            disabled={saving || !name.trim()}
                        >
                            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
