import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import cs from './locales/cs.json'
import ru from './locales/ru.json'
import en from './locales/en.json'
import uk from './locales/uk.json'

export type SupportedLanguage = 'cs' | 'ru' | 'uk' | 'en'

export const LOCALES: Record<SupportedLanguage, string> = {
  cs: 'cs-CZ',
  ru: 'ru-RU',
  uk: 'uk-UA',
  en: 'en-US',
}

export const AT_WORD: Record<SupportedLanguage, string> = {
  cs: 'v',
  ru: 'в',
  uk: 'о',
  en: 'at',
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      cs: { translation: cs },
      ru: { translation: ru },
      en: { translation: en },
      uk: { translation: uk },
    },
    fallbackLng: 'cs',
    supportedLngs: ['cs', 'ru', 'en', 'uk'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n