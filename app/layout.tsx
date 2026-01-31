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
    title: 'Vector Vault Search',
    description: '',
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
    const particlePositions = [
        { top: '10%', left: '5%' },
        { top: '30%', left: '80%' },
        { top: '50%', left: '20%' },
        { top: '70%', left: '70%' },
        { top: '85%', left: '40%' },
        { top: '15%', left: '60%' },
        { top: '40%', left: '30%' },
        { top: '60%', left: '90%' },
        { top: '25%', left: '10%' },
        { top: '55%', left: '55%' },
        { top: '5%', left: '50%' },
        { top: '45%', left: '5%' },
        { top: '65%', left: '25%' },
        { top: '35%', left: '85%' },
        { top: '80%', left: '15%' },
        { top: '20%', left: '40%' },
        { top: '75%', left: '60%' },
        { top: '90%', left: '80%' },
        { top: '12%', left: '30%' },
        { top: '68%', left: '48%' },
    ]
    return (
        <html lang="th" className={sarabun.variable}>
            <body className={sarabun.className}>
                <div className="fixed inset-y-0 left-0 flex items-center pointer-events-none">
                    <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary-400/20 to-transparent blur-3xl" />
                </div>
                <div className="fixed inset-y-0 right-0 flex items-center justify-end pointer-events-none">
                    <div className="h-44 w-44 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl" />
                </div>
                <div className="bg-particles">
                    {particlePositions.map((style, index) => (
                        <span
                            key={index}
                            className="particle"
                            style={{
                                ...style,
                                animationDelay: `${index * 0.9}s`,
                                animationDuration: `${20 + (index % 4) * 3}s`,
                            }}
                        />
                    ))}
                </div>
                {children}
                <BottomNav />
            </body>
        </html>
    )
}
