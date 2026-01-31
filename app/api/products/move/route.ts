import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/products/move - Move a product
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            product_id,
            to_box,
            to_row,
            to_slot,
            moved_by
        } = body

        if (!product_id || to_box === undefined || to_row === undefined || to_slot === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get current product location
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .single()

        if (fetchError) throw fetchError

        // Check if target slot is empty
        const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('box_no', to_box)
            .eq('row_no', to_row)
            .eq('slot_no', to_slot)
            .single()

        if (existingProduct && existingProduct.id !== product_id) {
            return NextResponse.json(
                { error: 'Target slot is already occupied' },
                { status: 400 }
            )
        }

        // Update product location
        const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update({
                box_no: to_box,
                row_no: to_row,
                slot_no: to_slot
            })
            .eq('id', product_id)
            .select()
            .single()

        if (updateError) throw updateError

        // Record move in history
        await supabase
            .from('move_history')
            .insert([{
                product_id,
                product_name: product.name,
                from_box: product.box_no,
                from_row: product.row_no,
                from_slot: product.slot_no,
                to_box,
                to_row,
                to_slot,
                moved_by
            }])

        return NextResponse.json(updatedProduct)
    } catch (error) {
        console.error('Error moving product:', error)
        return NextResponse.json(
            { error: 'Failed to move product' },
            { status: 500 }
        )
    }
}
