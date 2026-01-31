import th from './th'

export const translations = {
    th,
}

export type Language = keyof typeof translations

export const defaultLanguage: Language = 'th'

export function useTranslation(lang: Language = defaultLanguage) {
    return translations[lang]
}

// Export Thai as default
export { th }
export default th
