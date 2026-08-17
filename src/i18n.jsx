import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

function detectLanguage() {
  const saved = localStorage.getItem('veritx-lang')
  if (saved === 'en' || saved === 'es' || saved === 'fr') return saved
  return 'es'
}

const LOCALES = { es: 'es-MX', en: 'en-US', fr: 'fr-FR' }

export function localeFor(lang) {
  return LOCALES[lang] || 'en-US'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage)

  useEffect(() => {
    localStorage.setItem('veritx-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
