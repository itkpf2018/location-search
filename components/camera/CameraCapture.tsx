'use client'

import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image'
import { Camera, SwitchCamera, X, Check, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void
    onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [isCapturing, setIsCapturing] = useState(false)
    const webcamRef = useRef<Webcam>(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setIsCapturing(true)
            setTimeout(() => {
                setCapturedImage(imageSrc)
                setIsCapturing(false)
            }, 300)
        }
    }, [])

    const switchCamera = useCallback(() => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    }, [])

    const retake = useCallback(() => {
        setCapturedImage(null)
    }, [])

    const confirmCapture = useCallback(() => {
        if (capturedImage) {
            onCapture(capturedImage)
        }
    }, [capturedImage, onCapture])

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Camera View */}
            {!capturedImage && (
                <>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={0.95}
                        videoConstraints={{
                            facingMode,
                            width: { ideal: 1920 },
                            height: { ideal: 1080 }
                        }}
                        className={cn(
                            'w-full h-full object-cover transition-opacity',
                            isCapturing && 'opacity-0'
                        )}
                    />

                    {/* Capture Flash Effect */}
                    {isCapturing && (
                        <div className="absolute inset-0 bg-white animate-pulse" />
                    )}

                    {/* Grid Overlay for Composition */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-30">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/50" />
                            ))}
                        </div>
                    </div>

                    {/* Top Controls */}
                    <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-95"
                                aria-label="Close camera"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            <div className="text-white text-sm font-medium drop-shadow-lg">
                                ถ่ายรูปสินค้า
                            </div>

                            <button
                                onClick={switchCamera}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-95"
                                aria-label="Switch camera"
                            >
                                <SwitchCamera className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="flex items-center justify-center">
                            <button
                                onClick={capture}
                                className={cn(
                                    'w-20 h-20 rounded-full bg-white',
                                    'flex items-center justify-center',
                                    'shadow-2xl hover:scale-110 active:scale-95',
                                    'transition-transform duration-200',
                                    'border-4 border-white/50'
                                )}
                                aria-label="Capture photo"
                            >
                                <Camera className="w-10 h-10 text-primary-600" />
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 text-center">
                            <p className="text-white text-sm drop-shadow-lg">
                                วางสินค้าให้อยู่ตรงกลางและกดถ่ายรูป
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Preview */}
            {capturedImage && (
                <div className="relative w-full h-full bg-black">
                    <Image
                        src={capturedImage}
                        alt="Captured product"
                        fill
                        sizes="100vw"
                        unoptimized
                        className="object-contain"
                    />

                    {/* Preview Controls */}
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                            <button
                                onClick={retake}
                                className="flex-1 py-4 px-6 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RotateCw className="w-5 h-5" />
                                ถ่ายใหม่
                            </button>
                            <button
                                onClick={confirmCapture}
                                className="flex-1 py-4 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Check className="w-5 h-5" />
                                ใช้รูปนี้
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
