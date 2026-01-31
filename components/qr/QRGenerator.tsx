'use client'

import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Printer, QrCode as QrCodeIcon } from 'lucide-react'
import type { Product } from '@/lib/types'

interface QRGeneratorProps {
  product: Product
}

export function QRGenerator({ product }: QRGeneratorProps) {
  const qrValue = product.qr_code || product.id

  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `qr-${product.name.replace(/\s+/g, '-')}.png`
    link.href = url
    link.click()
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600')
    if (!printWindow) return

    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    const qrImage = canvas.toDataURL('image/png')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${product.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #000;
              padding: 20px;
              border-radius: 10px;
            }
            img {
              display: block;
              margin: 0 auto 20px;
            }
            h2 {
              margin: 0 0 10px;
              font-size: 18px;
            }
            p {
              margin: 0;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrImage}" alt="QR Code" />
            <h2>${product.name}</h2>
            <p>ตำแหน่ง: ${product.box_no}-${product.row_no}-${product.slot_no}</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <QrCodeIcon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">QR Code สินค้า</h3>
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-gray-200">
          <QRCodeCanvas
            id="qr-canvas"
            value={qrValue}
            size={200}
            level="H"
            includeMargin
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center mb-6 space-y-1">
        <p className="font-medium text-gray-900">{product.name}</p>
        <p className="text-sm text-gray-600">
          ตำแหน่ง: {product.box_no}-{product.row_no}-{product.slot_no}
        </p>
        <p className="text-xs text-gray-500 font-mono">
          ID: {product.id.slice(0, 8)}...
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          className="py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">ดาวน์โหลด</span>
        </button>
        <button
          onClick={handlePrint}
          className="py-3 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">พิมพ์</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          💡 สแกน QR Code เพื่อค้นหาสินค้าได้ทันที
        </p>
      </div>
    </div>
  )
}
