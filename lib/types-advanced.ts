// lib/types.ts - Add new types

export interface Category {
    id: string
    name: string
    color: string // Hex color
    icon: string // Lucide icon name
    description?: string
    created_at: string
    updated_at: string
    product_count?: number // From view
}

export interface ProductCategory {
    product_id: string
    category_id: string
    created_at: string
}

export interface MoveHistory {
    id: string
    product_id: string | null
    product_name: string
    from_box: number
    from_row: number
    from_slot: number
    to_box: number
    to_row: number
    to_slot: number
    moved_at: string
    moved_by?: string
    notes?: string
}

// Extend existing Product type
export interface Product {
    id: string
    name: string
    description?: string
    image_url?: string
    box_no: number
    row_no: number
    slot_no: number
    qr_code?: string // NEW
    created_at: string
    updated_at: string
    categories?: Category[] // NEW - populated via join
}
