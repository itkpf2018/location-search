import { NextRequest, NextResponse } from 'next/server'
import { IS_DEMO_MODE, demoStorage } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'
import { validateProductName, validateLocation, ValidationError } from '@/lib/validation'
import type { ProductInsert } from '@/lib/types'

// GET - Fetch all products
export async function GET() {
    try {
        // Demo Mode
        if (IS_DEMO_MODE) {
            const products = await demoStorage.getAll()
            return NextResponse.json({ products })
        }

        // Production Mode
        const supabase = await createClient()

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Fetch error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch products' },
                { status: 500 }
            )
        }

        return NextResponse.json({ products: products || [] })
    } catch (error) {
        console.error('GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, image_url, box_no, row_no, slot_no }: ProductInsert = body

        // Validate input
        validateProductName(name)
        validateLocation({ box_no, row_no, slot_no })

        // Demo Mode
        if (IS_DEMO_MODE) {
            // Check for duplicate location
            const allProducts = await demoStorage.getAll()
            const duplicate = allProducts.find(
                p => p.box_no === box_no && p.row_no === row_no && p.slot_no === slot_no
            )

            if (duplicate) {
                return NextResponse.json(
                    { error: 'This location is already occupied' },
                    { status: 400 }
                )
            }

            const newProduct = await demoStorage.create({
                name,
                image_url: image_url || null,
                box_no,
                row_no,
                slot_no,
                qr_code: null,
            })

            return NextResponse.json({ product: newProduct }, { status: 201 })
        }

        // Production Mode
        const supabase = await createClient()

        // Check for duplicate location
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('box_no', box_no)
            .eq('row_no', row_no)
            .eq('slot_no', slot_no)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: 'This location is already occupied' },
                { status: 400 }
            )
        }

        const { data: product, error } = await supabase
            .from('products')
            .insert({
                name,
                image_url: image_url || null,
                box_no,
                row_no,
                slot_no,
            })
            .select()
            .single()

        if (error) {
            console.error('Insert error:', error)
            return NextResponse.json(
                { error: 'Failed to create product' },
                { status: 500 }
            )
        }

        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        console.error('POST error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, image_url, box_no, row_no, slot_no } = body

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
        }

        // Validate input
        if (name) validateProductName(name)
        if (box_no && row_no && slot_no) {
            validateLocation({ box_no, row_no, slot_no })
        }

        // Demo Mode
        if (IS_DEMO_MODE) {
            // Check for duplicate location (excluding current product)
            if (box_no && row_no && slot_no) {
                const allProducts = await demoStorage.getAll()
                const duplicate = allProducts.find(
                    p => p.id !== id &&
                        p.box_no === box_no &&
                        p.row_no === row_no &&
                        p.slot_no === slot_no
                )

                if (duplicate) {
                    return NextResponse.json(
                        { error: 'This location is already occupied' },
                        { status: 400 }
                    )
                }
            }

            const updated = await demoStorage.update(id, {
                name,
                image_url,
                box_no,
                row_no,
                slot_no,
            })

            return NextResponse.json({ product: updated })
        }

        // Production Mode
        const supabase = await createClient()

        // Check for duplicate location
        if (box_no && row_no && slot_no) {
            const { data: existing } = await supabase
                .from('products')
                .select('id')
                .eq('box_no', box_no)
                .eq('row_no', row_no)
                .eq('slot_no', slot_no)
                .neq('id', id)
                .single()

            if (existing) {
                return NextResponse.json(
                    { error: 'This location is already occupied' },
                    { status: 400 }
                )
            }
        }

        const { data: product, error } = await supabase
            .from('products')
            .update({
                name,
                image_url,
                box_no,
                row_no,
                slot_no,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update error:', error)
            return NextResponse.json(
                { error: 'Failed to update product' },
                { status: 500 }
            )
        }

        return NextResponse.json({ product })
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        console.error('PUT error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
        }

        // Demo Mode
        if (IS_DEMO_MODE) {
            await demoStorage.delete(id)
            return NextResponse.json({ success: true })
        }

        // Production Mode
        const supabase = await createClient()

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            return NextResponse.json(
                { error: 'Failed to delete product' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
