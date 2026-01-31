import { demoStorage, DEMO_CATEGORIES, DEMO_PRODUCT_CATEGORY_MAP, inferCategoryIdFromName } from './demo-data'
import type { Product } from './types'

type MockMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

function createJsonResponse(payload: unknown, status = 200) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

function parseJsonBody(init?: RequestInit): Record<string, any> {
    if (!init?.body) {
        return {}
    }

    if (typeof init.body === 'string') {
        try {
            return JSON.parse(init.body)
        } catch {
            return {}
        }
    }

    if (init.body instanceof URLSearchParams) {
        return Object.fromEntries(init.body.entries())
    }

    return {}
}

const ensureNumber = (value: any): number | undefined => {
    const n = Number(value)
    if (Number.isNaN(n)) return undefined
    return n
}

async function handleProductsSearch(url: URL) {
    const params = url.searchParams
    const query = params.get('q') || ''
    const categoryId = params.get('category')

    const lowerQuery = query.toLowerCase()

    const allProducts = await demoStorage.getAll()
    const filtered = allProducts.filter((product) => {
        const matchesQuery = !query || product.name.toLowerCase().includes(lowerQuery)
        const matchesCategory = !categoryId || DEMO_PRODUCT_CATEGORY_MAP[product.id] === categoryId
        return matchesQuery && matchesCategory
    })

    return createJsonResponse({ products: filtered })
}

async function handleProductByQr(url: URL) {
    const qrCode = url.searchParams.get('qr')
    if (!qrCode) {
        return createJsonResponse({ product: null })
    }

    const allProducts = await demoStorage.getAll()
    const product = allProducts.find((item) => item.qr_code === qrCode)
    return createJsonResponse({ product: product || null })
}

async function handleProductsGet() {
    const products = await demoStorage.getAll()
    return createJsonResponse({ products })
}

async function handleCategories() {
    return createJsonResponse({ categories: DEMO_CATEGORIES })
}

async function handleProductsCreate(init?: RequestInit) {
    const body = parseJsonBody(init)
    const name = body.name?.toString().trim()
    const box_no = ensureNumber(body.box_no)
    const row_no = ensureNumber(body.row_no)
    const slot_no = ensureNumber(body.slot_no)

    if (!name || !box_no || !row_no || !slot_no) {
        return createJsonResponse({ error: 'Missing required fields' }, 400)
    }

    const products = await demoStorage.getAll()
    const duplicate = products.find(
        (p) => p.box_no === box_no && p.row_no === row_no && p.slot_no === slot_no
    )

    if (duplicate) {
        return createJsonResponse({ error: 'Slot already occupied' }, 400)
    }

    const product = await demoStorage.create({
        name,
        image_url: body.image_url || null,
        product_code: body.product_code,
        box_no,
        row_no,
        slot_no,
        qr_code: body.qr_code || null,
    })

    return createJsonResponse({ product }, 201)
}

async function handleProductsUpdate(init?: RequestInit) {
    const body = parseJsonBody(init)
    const id = body.id
    if (!id) {
        return createJsonResponse({ error: 'Product ID is required' }, 400)
    }

    const updates = {} as Partial<Product>
    if (body.name !== undefined) updates.name = body.name
    if (body.image_url !== undefined) updates.image_url = body.image_url
    if (body.product_code !== undefined) updates.product_code = body.product_code
    if (body.box_no !== undefined) {
        const value = ensureNumber(body.box_no)
        if (value !== undefined) {
            updates.box_no = value
        }
    }
    if (body.row_no !== undefined) {
        const value = ensureNumber(body.row_no)
        if (value !== undefined) {
            updates.row_no = value
        }
    }
    if (body.slot_no !== undefined) {
        const value = ensureNumber(body.slot_no)
        if (value !== undefined) {
            updates.slot_no = value
        }
    }

    const hasLocationUpdate =
        updates.box_no !== undefined || updates.row_no !== undefined || updates.slot_no !== undefined

    if (hasLocationUpdate) {
        const current = await demoStorage.getById(id)
        if (!current) {
            return createJsonResponse({ error: 'Product not found' }, 404)
        }

        const box = updates.box_no ?? current.box_no
        const row = updates.row_no ?? current.row_no
        const slot = updates.slot_no ?? current.slot_no

        const products = await demoStorage.getAll()
        const conflicting = products.find(
            (p) => p.id !== id && p.box_no === box && p.row_no === row && p.slot_no === slot
        )

        if (conflicting) {
            return createJsonResponse({ error: 'Slot already occupied' }, 400)
        }
    }

    try {
        const updatedProduct = await demoStorage.update(id, updates)
        return createJsonResponse({ product: updatedProduct })
    } catch (error: any) {
        return createJsonResponse({ error: error.message }, 404)
    }
}

async function handleProductsDelete(url: URL) {
    const id = url.searchParams.get('id')
    if (!id) {
        return createJsonResponse({ error: 'Product ID is required' }, 400)
    }

    await demoStorage.delete(id)
    return createJsonResponse({ success: true })
}

export async function handleMockApiFetch(input: string, init?: RequestInit) {
    const url = new URL(input, 'http://localhost')
    const path = url.pathname
    const method = (init?.method || 'GET').toUpperCase() as MockMethod

    if (path === '/api/products') {
        switch (method) {
            case 'GET':
                return handleProductsGet()
            case 'POST':
                return handleProductsCreate(init)
            case 'PUT':
                return handleProductsUpdate(init)
            case 'DELETE':
                return handleProductsDelete(url)
        }
    }

    if (path === '/api/categories' && method === 'GET') {
        return handleCategories()
    }

    if (path === '/api/search' && method === 'GET') {
        return handleProductsSearch(url)
    }

    if (path === '/api/products/search' && method === 'GET') {
        return handleProductByQr(url)
    }

    return createJsonResponse({ error: 'Mock endpoint not implemented' }, 501)
}
