import Success from '../../icons/Success'
import Time from '../../icons/Time'
import type { GroupedArray, SelectedSlot, Service } from '../../interfaces'
import { formatBookingDateTimeCs, formatDurationCsShort, groupServicesToArray } from '../../utils'

const SuccessPage = ({ selectedServices, selectedSlots }:
  {
    selectedServices: Service[]
    selectedSlots: Record<number, SelectedSlot | null>
}) => {
  const services = groupServicesToArray(selectedServices)

  const getFirstSlotInfo = (
    group: GroupedArray[],
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
          <h3 className='text-[18px] text-[var(--color-icon)] font-semibold'>{group.label}</h3>
          <div className='text-[var(--color-border)] mb-[var(--font-size-lg)]'>Datum: <span className='font-semibold text-[var(--color-icon)]'>{formatBookingDateTimeCs(slotInfo.date, slotInfo.startTime)}</span></div>

          {group.services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2">
                <div className='text-[var(--color-icon)] text-[16px]'>
                  {service.title}
                </div>

                <div className='flex justify-between'>
                  <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1'>
                    <Time />
                    {formatDurationCsShort(service.durationMinutes as number)}
                  </div>

                  <span className='text-[var(--color-icon)] text-[14px] font-semibold'>
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
      <div className='flex items-center justify-center gap-2 text-center text-[var(--color-icon)] border border-green-500 p-[var(--space-sm)] rounded-[var(--radius-sm)] w-[200px] my-[var(--space-lg)] mx-auto'>
        <Success />
        <span>Schůzka potvrzena</span>
      </div>

      
      {slots}
      {/* TOTAL */}
      <div className="flex justify-between pt-[var(--space-md)]">
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          Celkem:
        </span>
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          {totalPrice} Kč
        </span>
      </div>
    </div>
  )
}

export default SuccessPage