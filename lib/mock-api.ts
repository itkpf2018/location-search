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

export async function handleMockApiFetch(input: string, init?: RequestInit) {
    const url = new URL(input, 'http://localhost')
    const path = url.pathname
    const method = (init?.method || 'GET').toUpperCase() as MockMethod

    if (path === '/api/products' && method === 'GET') {
        return handleProductsGet()
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
