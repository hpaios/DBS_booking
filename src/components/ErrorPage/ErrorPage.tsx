import { useTranslation } from 'react-i18next'
import ErrorIcon from '../../icons/Error'
import PhoneIcon from '../../icons/Phone'

const ErrorPage = () => {
  const { t } = useTranslation()
  return(
    <>
      <div className='flex items-center justify-center gap-2 text-center text-[var(--color-icon)] border border-red-500 p-[var(--space-sm)] rounded-[var(--radius-sm)] w-[300px] my-[var(--space-lg)] mx-auto font-sans'>
        <ErrorIcon />
        <span>{t('error_page.title')}</span>
      </div>
      <div className='text-center text-[var(--color-border)] mt-[2rem]'>{t('error_page.description')}</div>
      <div className="flex justify-center mt-[1rem]">
        <div className="flex items-center">
          <PhoneIcon />
          <span className="ml-2">+420 720 773 201</span>
        </div>
      </div>
    </>
  )
}

export default ErrorPage