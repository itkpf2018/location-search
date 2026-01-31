'use client'

import { useState, useCallback, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { X, QrCode, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { apiFetch } from '@/lib/api-client'

interface QRScannerProps {
    onScan: (product: Product) => void
    onClose: () => void
}

export function QRCodeScanner({ onScan, onClose }: QRScannerProps) {
    const [scanning, setScanning] = useState(true)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchProductByQR = async (qrCode: string): Promise<Product | null> => {
        try {
            const response = await apiFetch(`/api/products/search?qr=${encodeURIComponent(qrCode)}`)
            if (!response.ok) return null

            const data = await response.json()
            return data.product || null
        } catch (error) {
            console.error('Error searching product:', error)
            return null
        }
    }

    const handleScan = async (result: any) => {
        if (!result || !scanning) return

        const qrCode = result[0]?.rawValue
        if (!qrCode) return

        setScanning(false)
        setSearching(true)
        setError(null)

        try {
            const product = await searchProductByQR(qrCode)

            if (product) {
                onScan(product)
            } else {
                setError('ไม่พบสินค้าที่ตรงกับ QR Code นี้')
                setTimeout(() => {
                    setScanning(true)
                    setSearching(false)
                    setError(null)
                }, 2000)
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการค้นหา')
            setTimeout(() => {
                setScanning(true)
                setSearching(false)
                setError(null)
            }, 2000)
        }
    }

    const handleError = (error: any) => {
        console.error('QR Scanner error:', error)
        setError('ไม่สามารถเข้าถึงกล้องได้')
    }

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Scanner */}
            {scanning && (
                <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                        facingMode: 'environment',
                        aspectRatio: { ideal: 1 }
                    }}
                    styles={{
                        container: {
                            width: '100%',
                            height: '100%'
                        },
                        video: {
                            objectFit: 'cover'
                        }
                    }}
                />
            )}

            {/* Searching State */}
            {searching && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                        <p className="text-white text-lg font-medium">กำลังค้นหาสินค้า...</p>
                    </div>
                </div>
            )}

            {/* Scanning Frame Overlay */}
            {scanning && !searching && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Dark Overlay with Cutout */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80">
                            <div className="w-full h-full border-4 border-primary-500 rounded-2xl shadow-2xl shadow-primary-500/50 animate-pulse" />

                            {/* Corner Markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl" />
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="absolute bottom-32 inset-x-0 text-center px-6">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 backdrop-blur-sm">
                            <QrCode className="w-5 h-5 text-primary-400" />
                            <p className="text-white font-medium">
                                วาง QR Code ในกรอบ
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-32 inset-x-0 px-6">
                    <div className="max-w-md mx-auto px-6 py-4 rounded-xl bg-red-500/90 backdrop-blur-sm">
                        <p className="text-white text-center font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-95 z-10"
                aria-label="Close scanner"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Top Info */}
            <div className="absolute top-6 left-6 right-20 z-10">
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <p className="text-white text-sm font-medium text-center">
                        สแกน QR Code เพื่อค้นหาสินค้า
                    </p>
                </div>
            </div>
        </div>
    )
}
