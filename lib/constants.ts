/**
 * Storage Location System Constants
 */

// Grid Configuration
export const GRID_CONFIG = {
    BOXES: 2,
    ROWS_PER_BOX: 6,
    SLOTS_PER_ROW: 8,
    TOTAL_SLOTS: 96, // 2 * 6 * 8 (default)
} as const;

// Editable limits for demo config
export const GRID_LIMITS = {
    BOXES: { MIN: 1, MAX: 8 },
    ROWS_PER_BOX: { MIN: 1, MAX: 12 },
    SLOTS_PER_ROW: { MIN: 1, MAX: 12 },
} as const;

// Validation Ranges
export const VALIDATION = {
    BOX_MIN: 1,
    BOX_MAX: GRID_LIMITS.BOXES.MAX,
    ROW_MIN: 1,
    ROW_MAX: GRID_LIMITS.ROWS_PER_BOX.MAX,
    SLOT_MIN: 1,
    SLOT_MAX: GRID_LIMITS.SLOTS_PER_ROW.MAX,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
    DEBOUNCE_MS: 300,
    MIN_QUERY_LENGTH: 1,
    MAX_RESULTS: 50,
} as const;

// Performance Targets
export const PERFORMANCE = {
    SEARCH_TIMEOUT_MS: 500,
    GRID_LOAD_TIMEOUT_MS: 2000,
} as const;

// Slot States
export const SLOT_STATE = {
    EMPTY: 'empty',
    OCCUPIED: 'occupied',
    HIGHLIGHTED: 'highlighted',
} as const;

// Animation Durations
export const ANIMATION = {
    HIGHLIGHT_DURATION_MS: 2000,
    SCROLL_DURATION_MS: 500,
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
    MAX_FILE_SIZE_MB: 5,
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    THUMBNAIL_WIDTH: 200,
    THUMBNAIL_HEIGHT: 200,
} as const;

// Supabase Storage
export const STORAGE = {
    BUCKET_NAME: 'product-images',
    PUBLIC_URL_EXPIRY: 60 * 60 * 24 * 365, // 1 year
} as const;

// Box Labels
export const BOX_LABELS = ['Box 1', 'Box 2'] as const;

// Row Labels (1-6)
export const ROW_LABELS = Array.from({ length: GRID_CONFIG.ROWS_PER_BOX }, (_, i) => i + 1);

// Slot Labels (1-8)
export const SLOT_LABELS = Array.from({ length: GRID_CONFIG.SLOTS_PER_ROW }, (_, i) => i + 1);
