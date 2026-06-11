import { useTranslation } from 'react-i18next'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const currentLang = i18n.language

  const getStyle = (lang: string) => ({
    color: currentLang.startsWith(lang) ? '#fff' : '#808080',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  })

  return (
    <div className='flex items-center gap-2 justify-center mt-4'>
      <button
        style={getStyle('cs')}
        onClick={() => i18n.changeLanguage('cs')}
      >
        CZ
      </button>
      <span className='text-[var(--color-gray)]'>|</span>
      <button
        style={getStyle('en')}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>
      <span className='text-[var(--color-gray)]'>|</span>
      <button
        style={getStyle('ru')}
        onClick={() => i18n.changeLanguage('ru')}
      >
        RU
      </button>
      <span className='text-[var(--color-gray)]'>|</span>
      <button
        style={getStyle('uk')}
        onClick={() => i18n.changeLanguage('uk')}
      >
        UK
      </button>
    </div>
  )
}