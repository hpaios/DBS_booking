import { useTimeSlots } from '../../api/hooks/useTimeslots'
import ErrorIcon from '../../icons/Error'
import type { ApiTimeSlot, SelectedSlot, Service, WeekScheduleItem } from '../../interfaces'
import { formatDurationCsShort, getUniqueParentCategoryIds, normalizeSlotsBySchedule, mapSlotsByDays, shiftSlotsByHour, filterSlotsByDuration } from '../../utils'
import Loader from '../Loader'
import ServicesCalendar from './ServicesCalendar'

interface SelectSlotProps {
  selectedServices: Service[]
  weekSchedule: WeekScheduleItem[]
  selectedSlots: Record<number, SelectedSlot | null>
  onSelectSlot: (employeeId: number, slot: SelectedSlot) => void
  selectedDates: Record<number, string>
  onSelectedDate: (dates: Record<number, string>) => void
}

const SelectSlots = ({
  selectedServices,
  weekSchedule,
  selectedSlots,
  onSelectSlot,
  selectedDates,
  onSelectedDate
}: SelectSlotProps) => {

  const uniqueParentCategoryIds = getUniqueParentCategoryIds(selectedServices)
  const { timeSlots, isLoading, isError } = useTimeSlots(uniqueParentCategoryIds)
  
  const servicesTimeSlots = Object.keys(timeSlots)

  const totalDuration = selectedServices.reduce(
  (sum, service) => sum + service.durationMinutes,
  0
  )

  const requiredSlots = Math.ceil(totalDuration / 60)

  const selectedTimes = Object.values(selectedSlots)
  .filter(Boolean)
  .map(s => s!.slot.dateStart)

  if (isLoading) return <Loader />
  if (isError) return <div className='flex items-center justify-center gap-2 text-center text-[var(--color-icon)] border border-red-500 p-[var(--space-sm)] rounded-[var(--radius-sm)] w-[300px] my-[var(--space-lg)] mx-auto font-sans'>
    <ErrorIcon />
    <span>Error</span>
  </div>

  return (
    <div className={`flex flex-col gap-8 ${selectedTimes.length ? 'pb-[100px]' : 'pb-1'}`}>
      {weekSchedule && servicesTimeSlots.map((employeeId) => {
        const employeeIdNum = Number(employeeId)

        const employeeServices = selectedServices.filter(
          service => service.parentCategoryId === employeeIdNum
        )

        if (!employeeServices.length) return null

        const totalPrice = employeeServices.reduce(
          (sum, service) => sum + service.price,
          0
        )

        const calendarSlots = shiftSlotsByHour(
          timeSlots[employeeIdNum] as unknown as ApiTimeSlot[]
        )

        const filteredSlots = filterSlotsByDuration(calendarSlots, requiredSlots)

        const normalizedSlots = normalizeSlotsBySchedule(filteredSlots, weekSchedule)

        const calendar = mapSlotsByDays(normalizedSlots)
        const defaultDate = Object.keys(calendar)[0]

        return (
          <div key={employeeId}>
            <h2 className='text-[var(--color-icon)] text-[16px] font-semibold font-sans'>{employeeServices[0].parentCategoryLabel} služby:</h2>

            {employeeServices.map(service => (
              <div key={service.id}>
                <div className='text-[var(--color-icon)] text-[16px] font-sans'>{service.title}</div>
                <div className='flex justify-between mb-[var(--space-sm)]'>
                  <span className='text-[var(--color-border)] font-sans'>{formatDurationCsShort(service.durationMinutes)}</span>
                  <span className='text-[var(--color-icon)] text-[16px] font-sans'>{service.price} Kč</span>
                </div>
              </div>
            ))}

            <div className='flex justify-between mb-[var(--space-xl)] font-sans'>
              <span>Celkem: </span>
              <span>{totalPrice} Kč</span>
            </div>

            <ServicesCalendar
              selectedTimes={selectedTimes}
              selectedSlot={selectedSlots[employeeIdNum]}
              selectedDate={selectedDates[employeeIdNum] ?? defaultDate}
              calendar={calendar}
              onSelectSlot={(slot, date) =>
                onSelectSlot(employeeIdNum, { slot, date })
              }
              onSelectDate={(date) =>
                onSelectedDate({ ...selectedDates, [employeeIdNum]: date })
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export default SelectSlots
