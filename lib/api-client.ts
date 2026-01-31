import { handleMockApiFetch } from './mock-api'

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? ''
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '')

export const API_BASE_URL = normalizedBaseUrl

export const isMockApi = !normalizedBaseUrl

function buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${normalizedBaseUrl}${cleanPath}`
}

export async function apiFetch(input: string, init?: RequestInit) {
    if (isMockApi) {
        return handleMockApiFetch(input, init)
    }

    const finalUrl = buildUrl(input)
    return fetch(finalUrl, init)
}
