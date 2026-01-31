import { NextRequest, NextResponse } from 'next/server'
import { IS_DEMO_MODE } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'
import { validateImageFile, ValidationError } from '@/lib/validation'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file
        validateImageFile(file)

        // Demo Mode: Return placeholder URL
        if (IS_DEMO_MODE) {
            // In demo mode, we'll use one of the existing demo images
            const demoImages = [
                '/demo-products/bearing.png',
                '/demo-products/hydraulic-pump.png',
                '/demo-products/motor-controller.png',
                '/demo-products/pressure-sensor.png',
                '/demo-products/valve-assembly.png',
            ]

            const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)]

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 500))

            return NextResponse.json({ url: randomImage })
        }

        // Production Mode: Upload to Supabase Storage
        const supabase = await createClient()

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        // Upload file
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) {
            console.error('Upload error:', error)
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path)

        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
