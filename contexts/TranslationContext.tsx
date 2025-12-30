import React, { createContext, useContext, useState, ReactNode } from 'react'
import { getTranslation, Language, TranslationKey } from '../translations'

type TranslationContextType = {
    t: (key: TranslationKey, params?: Record<string, string | number>) => string
    language: Language
    setLanguage: (lang: Language) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('sk')
    const translations = getTranslation(language)

    const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
        let text = translations[key] || key
        if (params) {
            for (const paramKey in params) {
                text = text.replace(`{${paramKey}}`, String(params[paramKey]))
            }
        }
        return text
    }

    return (
        <TranslationContext.Provider value={{ t, language, setLanguage }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => {
    const context = useContext(TranslationContext)
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider')
    }
    return context
}

