import { translations as enTranslations } from './en'
import { translations as skTranslations } from './sk'

export type TranslationKey = keyof typeof enTranslations

export const translations = {
    en: enTranslations,
    sk: skTranslations,
}

export type Language = 'en' | 'sk'

export const getTranslation = (lang: Language = 'sk'): typeof enTranslations => {
    return translations[lang] || translations.sk
}

