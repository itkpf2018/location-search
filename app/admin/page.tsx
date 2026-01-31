'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Home, Package as PackageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductList } from '@/components/admin/ProductList'
import { GridConfigPanel } from '@/components/admin/GridConfigPanel'
import { ToastContainer } from '@/components/ui/Toast'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import th from '@/lib/i18n/th'
import type { Product, ProductInsert } from '@/lib/types'
import type { ToastType } from '@/components/ui/Toast'
import { apiFetch } from '@/lib/api-client'

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7)
        setToasts((prev) => [...prev, { id, message, type }])
    }, [])

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await apiFetch('/api/products')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
            showToast(th.admin.failedToLoad, 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showToast])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const handleAddProduct = async (productData: ProductInsert) => {
        try {
            const response = await apiFetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || th.admin.failedToAdd)
            }

            await fetchProducts()
            showToast(th.admin.productAdded, 'success')
        } catch (error: any) {
            showToast(error.message, 'error')
            throw error
        }
    }

    const handleUpdateProduct = async (productData: Product & Partial<ProductInsert>) => {
        try {
            const response = await apiFetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || th.admin.failedToUpdate)
            }

            await fetchProducts()
            showToast(th.admin.productUpdated, 'success')
            setEditingProduct(null)
        } catch (error: any) {
            showToast(error.message, 'error')
            throw error
        }
    }

    const handleDeleteProduct = async (productId: string) => {
        try {
            const response = await apiFetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error(th.admin.failedToDelete)
            }

            await fetchProducts()
            showToast(th.admin.productDeleted, 'success')
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
    }

    const occupiedSlots = products
        .filter((p) => editingProduct?.id !== p.id)
        .map((p) => ({
            box_no: p.box_no,
            row_no: p.row_no,
            slot_no: p.slot_no,
        }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="glass-card border-b border-white/30 dark:border-slate-800/60 sticky top-0 z-30 hidden sm:block">
                <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex-shrink-0">
                                <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 truncate">
                                    {th.admin.title}
                                </h1>
                                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-slate-300 hidden xs:block truncate">
                                    {th.admin.subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <ThemeToggle className="hidden xs:inline-flex" />
                            <nav className="hidden sm:flex items-center gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">หน้าแรก</span>
                                </Link>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">จัดการระบบ</span>
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-sm">หมวดหมู่</span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4 sm:mb-6">
                        <GridConfigPanel products={products} />
                    </div>
                    {/* Actions Bar */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-4 sm:mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100">
                                {th.admin.products}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-0.5">
                                <span className="font-medium text-primary-600">{products.length}</span> {th.admin.product} {th.admin.inStorage}
                            </p>
                        </div>

                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="w-full xs:w-auto"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                            <span className="text-sm sm:text-base">{th.admin.addProduct}</span>
                        </Button>
                    </div>

                    {/* Product List */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-slate-300">{th.common.loading}</p>
                        </div>
                    ) : (
                        <ProductList
                            products={products}
                            onEdit={handleEdit}
                            onDelete={handleDeleteProduct}
                        />
                    )}
                </div>
            </main>

            {/* Product Form Modal */}
            <ProductForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                product={editingProduct}
                occupiedSlots={occupiedSlots}
            />

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    )
}
