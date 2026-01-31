import { NextRequest, NextResponse } from 'next/server'
import { IS_DEMO_MODE, demoStorage, DEMO_PRODUCT_CATEGORY_MAP, inferCategoryIdFromName } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'
import { sanitizeSearchQuery } from '@/lib/validation'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('q') || ''
        const categoryId = searchParams.get('category')

        // Sanitize input
        const sanitizedQuery = sanitizeSearchQuery(query)

        if (!sanitizedQuery && !categoryId) {
            return NextResponse.json({ products: [] })
        }

        // Demo Mode: Use mock data
        if (IS_DEMO_MODE) {
            let products = sanitizedQuery
                ? await demoStorage.search(sanitizedQuery)
                : await demoStorage.getAll()

            if (categoryId) {
                products = products.filter((p) => DEMO_PRODUCT_CATEGORY_MAP[p.id] === categoryId)
            }

            return NextResponse.json({ products })
        }

        // Production Mode: Use Supabase
        const supabase = await createClient()

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${sanitizedQuery || ''}%`)
            .order('name')

        if (error) {
            console.error('Search error:', error)
            return NextResponse.json(
                { error: 'Search failed' },
                { status: 500 }
            )
        }

        let filtered = products || []

        if (categoryId) {
            filtered = filtered.filter((p) => inferCategoryIdFromName(p.name) === categoryId)
        }

        return NextResponse.json({ products: filtered })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
