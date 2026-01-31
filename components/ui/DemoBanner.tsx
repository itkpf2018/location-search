'use client'

import { AlertCircle, Sparkles } from 'lucide-react'

export function DemoBanner() {
    return (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <p className="text-sm md:text-base font-medium">
                    <span className="font-bold">🎉 DEMO MODE</span> - Try all features instantly! No setup required.
                </p>
                <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
        </div>
    )
}

export function DemoModeIndicator() {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">DEMO</span>
            </div>
        </div>
    )
}
