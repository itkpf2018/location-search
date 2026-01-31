// Mock Data for Demo Mode (No Supabase Required)
import type { Product } from './types'
import type { Category } from './types-advanced'
import { GRID_CONFIG } from './constants'

    const TOOLS_AND_AUTO_ITEMS = [
    'ค้อนปอนด์', 'ชุดไขควง', 'ประแจเลื่อน', 'คีม', 'สว่านไฟฟ้า', 'เลื่อยมือ', 'เทปวัด', 'ระดับน้ำ', 'มีดอเนกประสงค์', 'ชุดแอลเลน',
    'ประแจบ็อกซ์', 'ประแจท่อ', 'ตัดสายไฟ', 'เลื่อยฉลุ', 'สิ่วไม้', 'ตะไบโลหะ', 'ซีกแคลมป์', 'มือจับจักร', 'ค้อนยาง', 'ขวานเล็ก',
    'น้ำมันเครื่อง 5W30', 'น้ำมันสังเคราะห์', 'น้ำมันเบรค', 'น้ำมันเกียร์', 'น้ำมันพวงมาลัย', 'ยางรถยนต์', 'ยางลุย', 'ยางใน', 'แบตเตอรี่รถยนต์', 'หัวเทียน',
    'แผ่นกรองอากาศ', 'แผ่นกรองน้ำมัน', 'แผ่นกรองเชื้อเพลิง', 'ผ้าเบรค', 'ดิสก์เบรค', 'โช้คอัพ', 'ปัดน้ำฝน', 'หลอดไฟหน้า', 'ฟิวส์รถยนต์', 'แม่แรงไฮดรอลิก',
    'สายพ่วงแบต', 'เกจ์วัดลม', 'ปั๊มลม', 'เครื่องขัดรถ', 'แชมพูรถ', 'ผ้าไมโครไฟเบอร์', 'ฟองน้ำล้าง', 'ถังพลาสติก', 'แว่นตานิรภัย', 'ถุงมือช่าง',
    'หมวกนิรภัย', 'ที่ครอบหู', 'หน้ากากกันฝุ่น', 'เสื้อสะท้อนแสง', 'รองเท้านิรภัย', 'กล่องเครื่องมือเหล็ก', 'กระเป๋าเครื่องมือ', 'สายยาวต่อ', 'ปลั๊กพ่วง', 'ไฟฉาย LED',
    'ไฟส่องงาน', 'บันไดอะลูมิเนียม', 'เก้าอี้เตี้ย', 'รถเข็น', 'เสียมสวน', 'คราดใบไม้', 'สายยางสวน', 'แปรงทาสี', 'ลูกกลิ้งทาสี', 'เทปกาว',
    'เทปท่อ', 'เทปไฟฟ้า', 'กาวทันตแพทย์', 'ซิลิโคนซีล', 'สเปรย์หล่อลื่น', 'น้ำยาขจัดสนิม', 'กระดาษทราย', 'ฝ้ายขัด', 'สายรัดเคเบิล'
]

export const DEMO_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'เครื่องยนต์/มอเตอร์', color: '#3B82F6', icon: 'Settings', description: 'เครื่องยนต์ มอเตอร์ ระบบขับเคลื่อน', created_at: '', updated_at: '' },
    { id: 'cat-2', name: 'เซนเซอร์/ควบคุม', color: '#10B981', icon: 'Cpu', description: 'เซนเซอร์ สวิตช์ อุปกรณ์ควบคุม', created_at: '', updated_at: '' },
    { id: 'cat-3', name: 'ปั๊ม/วาล์ว/ของเหลว', color: '#F59E0B', icon: 'Gauge', description: 'ปั๊ม วาล์ว ของเหลว ระบบไฮดรอลิก', created_at: '', updated_at: '' },
    { id: 'cat-4', name: 'ชิ้นส่วนกลไก', color: '#EF4444', icon: 'Cog', description: 'เฟือง สายพาน โซ่ คัปปลิ้ง', created_at: '', updated_at: '' },
    { id: 'cat-5', name: 'เครื่องมือ/อุปกรณ์', color: '#8B5CF6', icon: 'Wrench', description: 'เครื่องมือช่าง อุปกรณ์หน้างาน', created_at: '', updated_at: '' },
]

const DEMO_CATEGORY_IDS = DEMO_CATEGORIES.map((cat) => cat.id)
export const DEMO_PRODUCT_CATEGORY_MAP: Record<string, string> = {}

export const inferCategoryIdFromName = (name: string): string | null => {
    const lower = name.toLowerCase()
    if (/(engine|motor|drive)/.test(lower)) return 'cat-1'
    if (/(sensor|controller|switch|control)/.test(lower)) return 'cat-2'
    if (/(pump|valve|fluid|oil)/.test(lower)) return 'cat-3'
    if (/(belt|gear|coupling|shaft|chain|sprocket)/.test(lower)) return 'cat-4'
    return 'cat-5'
}

const DEMO_IMAGE_POOL = [
    'bearing.png',
    'hydraulic-pump.png',
    'motor-controller.png',
    'pressure-sensor.png',
    'valve-assembly.png',
    'gear-box.png',
    'belt-drive.png',
    'chain-sprocket.png',
    'coupling.png',
    'electric-motor.png',
    'real-001.jpg',
    'real-002.jpg',
    'real-003.jpg',
    'real-004.jpg',
    'real-005.jpg',
    'real-010.jpg',
    'real-011.jpg',
    'real-013.jpg',
    'real-017.jpg',
    'real-021.jpg',
]

const createDemoProducts = (count: number): Product[] => {
    const products: Product[] = []
    const slotsPerBox = GRID_CONFIG.ROWS_PER_BOX * GRID_CONFIG.SLOTS_PER_ROW
    const totalSlots = GRID_CONFIG.BOXES * slotsPerBox

    const positions = Array.from({ length: totalSlots }, (_, index) => {
        const boxIndex = Math.floor(index / slotsPerBox)
        const withinBox = index % slotsPerBox
        const rowNo = Math.floor(withinBox / GRID_CONFIG.SLOTS_PER_ROW) + 1
        const slotNo = (withinBox % GRID_CONFIG.SLOTS_PER_ROW) + 1
        const boxNo = boxIndex + 1
        return { boxNo, rowNo, slotNo }
    })

    // Deterministic shuffle for consistent but scattered demo layout
    let seed = 20260131
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296
        return seed / 4294967296
    }

    for (let i = positions.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1))
        const temp = positions[i]
        positions[i] = positions[j]
        positions[j] = temp
    }

    for (let i = 0; i < count; i += 1) {
        const position = positions[i]
        if (!position) break

        // Use the specific item name if available, otherwise fallback to generic
        const name = TOOLS_AND_AUTO_ITEMS[i] || `Tool ${i + 1}`

        const productId = String(i + 1)
        const categoryId = inferCategoryIdFromName(name) || DEMO_CATEGORY_IDS[i % DEMO_CATEGORY_IDS.length]
        DEMO_PRODUCT_CATEGORY_MAP[productId] = categoryId

        // Real photo placeholders (no SVG)
        const imageFile =
            DEMO_IMAGE_POOL[i % DEMO_IMAGE_POOL.length] || 'real-001.jpg'
        const imageUrl = `/demo-products/${imageFile}`

        products.push({
            id: productId,
            name: name,
            image_url: imageUrl,
            product_code: `SKU-${String(i + 1).padStart(4, '0')}`,
            box_no: position.boxNo,
            row_no: position.rowNo,
            slot_no: position.slotNo,
            qr_code: `QR-${String(i + 1).padStart(4, '0')}`,
            created_at: new Date(2026, 0, 15, 10, i).toISOString(),
            updated_at: new Date(2026, 0, 15, 10, i).toISOString(),
        })
    }

    return products
}

export const DEMO_PRODUCTS: Product[] = createDemoProducts(79)

const STORAGE_KEY = 'storage-location-finder-demo-products'

const loadStoredProducts = (): Product[] => {
    if (typeof window === 'undefined') {
        return [...DEMO_PRODUCTS]
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return [...DEMO_PRODUCTS]
        }
        return JSON.parse(raw) as Product[]
    } catch {
        return [...DEMO_PRODUCTS]
    }
}

const persistProducts = (products: Product[]) => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
        /* ignore */
    }
}

// Check if we're in demo mode (no Supabase configured)
export const IS_DEMO_MODE =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-project-url'

// In-memory storage for demo mode
let demoProductsState = loadStoredProducts()

export const demoStorage = {
    getAll: () => Promise.resolve([...demoProductsState]),

    search: (query: string) => {
        const lowerQuery = query.toLowerCase()
        return Promise.resolve(
            demoProductsState.filter(p =>
                p.name.toLowerCase().includes(lowerQuery)
            )
        )
    },

    getById: (id: string) => {
        return Promise.resolve(
            demoProductsState.find(p => p.id === id) || null
        )
    },

    create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
        const newProduct: Product = {
            ...product,
            id: String(Date.now()),
            qr_code: product.qr_code || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        demoProductsState.push(newProduct)
        persistProducts(demoProductsState)
        return Promise.resolve(newProduct)
    },

    update: (id: string, updates: Partial<Product>) => {
        const index = demoProductsState.findIndex(p => p.id === id)
        if (index === -1) return Promise.reject(new Error('Product not found'))

        demoProductsState[index] = {
            ...demoProductsState[index],
            ...updates,
            updated_at: new Date().toISOString(),
        }
        persistProducts(demoProductsState)
        return Promise.resolve(demoProductsState[index])
    },

    delete: (id: string) => {
        demoProductsState = demoProductsState.filter(p => p.id !== id)
        persistProducts(demoProductsState)
        return Promise.resolve()
    },

    reset: () => {
        demoProductsState = [...DEMO_PRODUCTS]
        persistProducts(demoProductsState)
        return Promise.resolve()
    },
}
