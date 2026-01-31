'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IMAGE_CONFIG } from '@/lib/constants'
import { apiFetch } from '@/lib/api-client'

interface ImageUploadProps {
    value?: string | null
    onChange: (url: string | null) => void
    onUploadStart?: () => void
    onUploadEnd?: () => void
}

export function ImageUpload({ value, onChange, onUploadStart, onUploadEnd }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(value || null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        // Validate file
        if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE_BYTES) {
            setError(`File size must be less than ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`)
            return
        }

        if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
            setError('Only JPEG, PNG, and WebP images are allowed')
            return
        }

        try {
            setIsUploading(true)
            onUploadStart?.()

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            // Upload to server
            const formData = new FormData()
            formData.append('file', file)

            const response = await apiFetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            onChange(data.url)
        } catch (err) {
            console.error('Upload error:', err)
            setError('Failed to upload image')
            setPreview(null)
        } finally {
            setIsUploading(false)
            onUploadEnd?.()
        }
    }

    const handleRemove = () => {
        setPreview(null)
        onChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    useEffect(() => {
        setPreview(value || null)
    }, [value])

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Product Image
            </label>

            {preview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 group">
                    <Image
                        src={preview}
                        alt="Product preview"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleRemove}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
                >
                    {isUploading ? (
                        <>
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload image</p>
                            <p className="text-xs text-gray-500">
                                JPEG, PNG, WebP (max {IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB)
                            </p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={IMAGE_CONFIG.ALLOWED_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
