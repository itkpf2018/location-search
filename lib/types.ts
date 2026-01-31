/**
 * Database Types
 * Generated from Supabase schema
 */

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description?: string | null
                    image_url: string | null
                    product_code?: string | null
                    box_no: number
                    row_no: number
                    slot_no: number
                    qr_code: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    image_url?: string | null
                    product_code?: string | null
                    box_no: number
                    row_no: number
                    slot_no: number
                    qr_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    image_url?: string | null
                    product_code?: string | null
                    box_no?: number
                    row_no?: number
                    slot_no?: number
                    qr_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

/**
 * Location interface for slot positioning
 */
export interface Location {
    box_no: number
    row_no: number
    slot_no: number
}

/**
 * Search result with product and location
 */
export type SearchResult = Product

/**
 * Slot data for grid display
 */
export interface SlotData {
    box: number
    row: number
    slot: number
    product: Product | null
    isHighlighted: boolean
}
