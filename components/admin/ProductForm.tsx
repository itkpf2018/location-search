'use client'

import React, { useState, useEffect } from 'react'
import { Camera, Tag, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUpload } from './ImageUpload'
import { LocationPicker } from './LocationPicker'
import { CameraCapture } from '@/components/camera/CameraCapture'
import { ImageEditor } from '@/components/camera/ImageEditor'
import { QRGenerator } from '@/components/qr/QRGenerator'
import type { Product, ProductInsert } from '@/lib/types'

interface ProductFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (product: any) => Promise<void>
    product?: Product | null
    occupiedSlots: Array<{ box_no: number; row_no: number; slot_no: number }>
}

export function ProductForm({
    isOpen,
    onClose,
    onSubmit,
    product,
    occupiedSlots,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductInsert>({
        name: product?.name || '',
        image_url: product?.image_url || null,
        box_no: product?.box_no || 1,
        row_no: product?.row_no || 1,
        slot_no: product?.slot_no || 1,
        product_code: product?.product_code || '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [showImageEditor, setShowImageEditor] = useState(false)
    const [showQRCode, setShowQRCode] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.name.trim()) {
            setError('Product name is required')
            return
        }

        try {
            setIsSubmitting(true)

            if (product) {
                // Update existing product
                await onSubmit({ ...product, ...formData })
            } else {
                // Create new product
                await onSubmit(formData)
            }

            onClose()

            // Reset form
            setFormData({
                name: '',
                image_url: null,
                box_no: 1,
                row_no: 1,
                slot_no: 1,
            })
        } catch (err: any) {
            setError(err.message || 'Failed to save product')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCameraCapture = (imageSrc: string) => {
        setCapturedImage(imageSrc)
        setShowCamera(false)
        setShowImageEditor(true)
    }

    const handleImageEdited = (editedImage: string) => {
        setFormData({ ...formData, image_url: editedImage })
        setShowImageEditor(false)
        setCapturedImage(null)
    }

    useEffect(() => {
        setFormData({
            name: product?.name || '',
            image_url: product?.image_url || null,
            box_no: product?.box_no || 1,
            row_no: product?.row_no || 1,
            slot_no: product?.slot_no || 1,
            product_code: product?.product_code || '',
        })
        setError(null)
        setCapturedImage(null)
        setShowImageEditor(false)
        setShowQRCode(false)
        setShowCamera(false)
    }, [product])

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={product ? 'Edit Product' : 'Add New Product'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div className="col-span-2 sm:col-span-1">
                            <Input
                                label="Product Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Product Code */}
                        <div className="col-span-2 sm:col-span-1">
                            <Input
                                label="Product Code"
                                type="text"
                                value={formData.product_code || ''}
                                onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                                placeholder="e.g. SKU-1234"
                            />
                        </div>
                    </div>

                    {/* Category Selection (Mockup) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <div className="flex gap-2">
                            <select
                                className="input flex-1"
                                defaultValue=""
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="1">Raw Materials</option>
                                <option value="2">Electronics</option>
                                <option value="3">Tools</option>
                                <option value="4">Spare Parts</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    const newCat = prompt('Enter new category name:')
                                    if (newCat) alert(`Mockup: Created category "${newCat}"`)
                                }}
                                className="btn-secondary px-3"
                                title="Add Category"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Image Upload with Camera Button */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>
                        <div className="space-y-3">
                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCamera(true)}
                                    className="py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600"
                                >
                                    <Camera className="w-5 h-5" />
                                    <span className="font-medium text-sm">ถ่ายรูป</span>
                                </button>
                                {product && (
                                    <button
                                        type="button"
                                        onClick={() => setShowQRCode(true)}
                                        className="py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600"
                                    >
                                        <Tag className="w-5 h-5" />
                                        <span className="font-medium text-sm">QR Code</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Picker */}
                    <LocationPicker
                        boxNo={formData.box_no}
                        rowNo={formData.row_no}
                        slotNo={formData.slot_no}
                        onChange={(location) =>
                            setFormData({
                                ...formData,
                                box_no: location.box_no,
                                row_no: location.row_no,
                                slot_no: location.slot_no,
                            })
                        }
                        occupiedSlots={occupiedSlots}
                        currentProductId={product?.id}
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            {product ? 'Update Product' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Camera Capture Modal */}
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}

            {/* Image Editor Modal */}
            {showImageEditor && capturedImage && (
                <ImageEditor
                    imageSrc={capturedImage}
                    onSave={handleImageEdited}
                    onCancel={() => {
                        setShowImageEditor(false)
                        setCapturedImage(null)
                    }}
                />
            )}

            {/* QR Code Generator Modal */}
            {showQRCode && product && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <QRGenerator product={product} />
                        <button
                            onClick={() => setShowQRCode(false)}
                            className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
