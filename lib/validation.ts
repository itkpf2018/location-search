import { VALIDATION, IMAGE_CONFIG } from './constants'
import type { Location } from './types'

/**
 * Validation utilities for product data
 */

export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

/**
 * Validate product name
 */
export function validateProductName(name: string): void {
    if (!name || name.trim().length === 0) {
        throw new ValidationError('Product name is required')
    }

    if (name.length > 255) {
        throw new ValidationError('Product name must be less than 255 characters')
    }

    // Sanitize: remove potentially dangerous characters
    const sanitized = name.replace(/[<>]/g, '')
    if (sanitized !== name) {
        throw new ValidationError('Product name contains invalid characters')
    }
}

/**
 * Validate location (box, row, slot)
 */
export function validateLocation(location: Location): void {
    const { box_no, row_no, slot_no } = location

    if (
        box_no < VALIDATION.BOX_MIN ||
        box_no > VALIDATION.BOX_MAX
    ) {
        throw new ValidationError(
            `Box number must be between ${VALIDATION.BOX_MIN} and ${VALIDATION.BOX_MAX}`
        )
    }

    if (
        row_no < VALIDATION.ROW_MIN ||
        row_no > VALIDATION.ROW_MAX
    ) {
        throw new ValidationError(
            `Row number must be between ${VALIDATION.ROW_MIN} and ${VALIDATION.ROW_MAX}`
        )
    }

    if (
        slot_no < VALIDATION.SLOT_MIN ||
        slot_no > VALIDATION.SLOT_MAX
    ) {
        throw new ValidationError(
            `Slot number must be between ${VALIDATION.SLOT_MIN} and ${VALIDATION.SLOT_MAX}`
        )
    }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): void {
    // Check file size
    if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE_BYTES) {
        throw new ValidationError(
            `Image size must be less than ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`
        )
    }

    // Check file type
    if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
        throw new ValidationError(
            `Image must be one of: ${IMAGE_CONFIG.ALLOWED_TYPES.join(', ')}`
        )
    }
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
    return query
        .trim()
        .replace(/[<>]/g, '') // Remove potential XSS characters
        .substring(0, 100) // Limit length
}
