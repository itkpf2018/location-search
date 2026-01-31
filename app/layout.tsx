import type { Metadata, Viewport } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/ui/BottomNav'

// Thai-optimized font
const sarabun = Sarabun({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['thai', 'latin'],
    display: 'swap',
    variable: '--font-sarabun',
})

export const metadata: Metadata = {
    title: 'ระบบค้นหาตำแหน่งสินค้า',
    description: 'ค้นหาสินค้าได้ทันทีด้วยแผนที่ตำแหน่งแบบ Visual - รองรับ PWA',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'ค้นหาตำแหน่งสินค้า',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#3B82F6',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th" className={sarabun.variable}>
            <body className={sarabun.className}>
                {children}
                <BottomNav />
            </body>
        </html>
    )
}
