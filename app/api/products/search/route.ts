import { NextRequest, NextResponse } from 'next/server'
import { IS_DEMO_MODE, demoStorage } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const qr = searchParams.get('qr')
        const code = searchParams.get('code') || searchParams.get('barcode')

        const value = qr || code
        if (!value) {
            return NextResponse.json({ product: null }, { status: 400 })
        }

        if (IS_DEMO_MODE) {
            const products = await demoStorage.getAll()
            const product = products.find(
                (p) => p.qr_code === value || p.product_code === value
            )
            return NextResponse.json({ product: product || null })
        }

        const supabase = await createClient()

        let product = null
        const { data: qrMatch, error: qrError } = await supabase
            .from('products')
            .select('*')
            .eq('qr_code', value)
            .maybeSingle()

        if (qrError) {
            console.error('QR search error:', qrError)
        }

        if (qrMatch) {
            product = qrMatch
        } else {
            const { data: codeMatch, error: codeError } = await supabase
                .from('products')
                .select('*')
                .eq('product_code', value)
                .maybeSingle()

            if (codeError) {
                console.error('Code search error:', codeError)
            }

            product = codeMatch || null
        }

        return NextResponse.json({ product })
    } catch (error) {
        console.error('QR search error:', error)
        return NextResponse.json({ product: null }, { status: 500 })
    }
}
