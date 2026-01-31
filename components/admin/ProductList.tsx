'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit, Trash2, Package, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatLocation } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductListProps {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (productId: string) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const pageSize = 20

    const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
    const currentPage = Math.min(page, totalPages)

    const pagedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return products.slice(start, start + pageSize)
    }, [products, currentPage])

    const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
    const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

    const handleDelete = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return
        }

        try {
            setDeletingId(product.id)
            await onDelete(product.id)
        } finally {
            setDeletingId(null)
        }
    }

    if (products.length === 0) {
        return (
            <Card className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    No products yet
                </h3>
                <p className="text-gray-500 dark:text-slate-300">
                    Click &quot;Add Product&quot; to create your first product
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                <span>
                    แสดง {pagedProducts.length} จาก {products.length} รายการ
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                        ก่อนหน้า
                    </button>
                    <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {pagedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow p-3 sm:p-4">
                    {/* Product Image */}
                    {product.image_url ? (
                        <div className="relative w-full h-28 xs:h-32 sm:h-40 bg-gray-100">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-28 xs:h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1 sm:mb-2 truncate text-sm sm:text-base" title={product.name}>
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-2 sm:mb-4">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
                            <span className="truncate">{formatLocation(product.box_no, product.row_no, product.slot_no)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 sm:gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onEdit(product)}
                                className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                            >
                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                                แก้ไข
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(product)}
                                isLoading={deletingId === product.id}
                                className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                            >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                                ลบ
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
            </div>
        </div>
    )
}
