import { createClient } from '@/lib/supabase/server'
import { IS_DEMO_MODE, DEMO_CATEGORIES } from '@/lib/demo-data'
import { NextResponse } from 'next/server'

// GET /api/categories - Get all categories
export async function GET() {
    try {
        if (IS_DEMO_MODE) {
            return NextResponse.json(DEMO_CATEGORIES)
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('category_stats')
            .select('*')
            .order('name')

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

// POST /api/categories - Create new category
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, color, icon, description } = body

        if (!name || !color || !icon) {
            return NextResponse.json(
                { error: 'Name, color, and icon are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, color, icon, description }])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}
