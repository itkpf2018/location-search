import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/move-history - Get move history
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const productId = searchParams.get('product_id')

        const supabase = await createClient()

        let query = supabase
            .from('recent_moves')
            .select('*')
            .limit(limit)

        if (productId) {
            query = query.eq('product_id', productId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching move history:', error)
        return NextResponse.json(
            { error: 'Failed to fetch move history' },
            { status: 500 }
        )
    }
}

// POST /api/move-history - Record a move
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            product_id,
            product_name,
            from_box,
            from_row,
            from_slot,
            to_box,
            to_row,
            to_slot,
            moved_by,
            notes
        } = body

        if (!product_name || from_box === undefined || to_box === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('move_history')
            .insert([{
                product_id,
                product_name,
                from_box,
                from_row,
                from_slot,
                to_box,
                to_row,
                to_slot,
                moved_by,
                notes
            }])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error recording move:', error)
        return NextResponse.json(
            { error: 'Failed to record move' },
            { status: 500 }
        )
    }
}
