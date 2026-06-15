import { useTranslation } from 'react-i18next'
import InfoIcon from '../../icons/Info'
import Success from '../../icons/Success'
import Time from '../../icons/Time'
import type { GroupedArray, SelectedSlot, Service } from '../../interfaces'
import { formatBookingDateTimeCs, formatDurationShort, groupServicesToArray } from '../../utils'

const SuccessPage = ({ selectedServices, selectedSlots }:
  {
    selectedServices: Service[]
    selectedSlots: Record<number, SelectedSlot | null>
}) => {
  const { t, i18n } = useTranslation()
  const services = groupServicesToArray(selectedServices)

  const getFirstSlotInfo = (
    group: GroupedArray,
    selectedSlots: Record<number, SelectedSlot | null>
  ) => {
    const parentCategoryId = group.services[0]?.parentCategoryId
    const selectedBooking = selectedSlots[parentCategoryId]

    return {
      date: selectedBooking?.date ?? '',
      startTime: selectedBooking?.slot?.dateStart?.slice(11, 16) ?? ''
    }
  }

  const totalPrice = services
    .flatMap(group => group.services)
    .reduce((sum, service) => sum + service.price, 0)

  const slots = services.map((group) => {
  const slotInfo = getFirstSlotInfo(group, selectedSlots)

    return (
        <div key={group.label} className='mb-[var(--font-size-lg)]'>
          <h3 className='text-[18px] text-[var(--color-icon)] font-semibold font-sans'>{group.label}</h3>
          <div className='text-[var(--color-border)] font-sans mb-[var(--font-size-lg)]'>Datum: <span className='font-semibold text-[var(--color-icon)] font-sans'>{formatBookingDateTimeCs(slotInfo.date, slotInfo.startTime)}</span></div>

          {group.services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2">
                <div className='text-[var(--color-icon)] text-[16px] font-sans'>
                  {service.title}
                </div>

                <div className='flex justify-between'>
                  <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1 font-sans'>
                    <Time />
                    {formatDurationShort(service.durationMinutes as unknown as number, i18n.language)}
                  </div>

                  <span className='text-[var(--color-icon)] text-[14px] font-semibold font-sans'>
                    {service.price} Kč
                  </span>
                </div>
              </div>
          ))}
        </div>
      )
  })

  return (
    <div>
      <div className='flex items-center justify-center gap-2 text-center text-[var(--color-icon)] border border-green-500 p-[var(--space-sm)] rounded-[var(--radius-sm)] w-[200px] my-[var(--space-lg)] mx-auto font-sans'>
        <Success />
        <span>{t('success_page.title')}</span>
      </div>

      
      {slots}
      {/* TOTAL */}
      <div className="flex justify-between pt-[var(--space-md)]">
        <span className="text-[var(--color-icon)] text-[16px] font-semibold font-sans">
          {t('common.total')}:
        </span>
        <span className="text-[var(--color-icon)] text-[16px] font-semibold font-sans">
          {totalPrice} Kč
        </span>
      </div>
      <div className='flex items-center gap-2 text-[var(--color-border)] text-[12px] font-sans mt-[var(--space-md)]'>
        <InfoIcon width="40" height="40" />
        <span>{t('success_page.description')}</span>
      </div>
    </div>
  )
}

export default SuccessPage