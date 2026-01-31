'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Sun, Contrast, RotateCw, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageEditorProps {
    imageSrc: string
    onSave: (editedImage: string) => void
    onCancel: () => void
}

export function ImageEditor({ imageSrc, onSave, onCancel }: ImageEditorProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', error => reject(error))
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0
    ): Promise<string> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        canvas.width = safeArea
        canvas.height = safeArea

        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        )

        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        )

        return canvas.toDataURL('image/jpeg', 0.95)
    }

    const handleSave = async () => {
        if (!croppedAreaPixels) return

        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            onSave(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Cropper Area */}
            <div
                className="flex-1 relative"
                style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`
                }}
            >
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    objectFit="contain"
                />
            </div>

            {/* Controls Panel */}
            <div className="bg-gray-900 p-6 space-y-4">
                {/* Zoom */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <span>ซูม</span>
                        <span className="text-gray-400 text-xs">{Math.round(zoom * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="slider w-full"
                    />
                </div>

                {/* Rotation */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <RotateCw className="w-4 h-4" />
                        <span>หมุน</span>
                        <span className="text-gray-400 text-xs">{rotation}°</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="slider w-full"
                    />
                </div>

                {/* Brightness */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <Sun className="w-4 h-4" />
                        <span>ความสว่าง</span>
                        <span className="text-gray-400 text-xs">{brightness}%</span>
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="150"
                        step="1"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="slider w-full"
                    />
                </div>

                {/* Contrast */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <Contrast className="w-4 h-4" />
                        <span>ความคมชัด</span>
                        <span className="text-gray-400 text-xs">{contrast}%</span>
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="150"
                        step="1"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="slider w-full"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-6 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors active:scale-95 flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Check className="w-5 h-5" />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    )
}
