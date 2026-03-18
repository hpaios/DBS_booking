import { useTimeSlots } from '../../api/hooks/useTimeslots'
import type { ApiTimeSlot, SelectedSlot, Service, WeekScheduleItem } from '../../interfaces'
import { formatDurationCsShort, getUniqueParentCategoryIds, normalizeSlotsBySchedule, mapSlotsByDays, shiftSlotsByHour, filterSlotsByDuration } from '../../utils'
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
  const { timeSlots } = useTimeSlots(uniqueParentCategoryIds)
  
  const servicesTimeSlots = Object.keys(timeSlots)

  const totalDuration = selectedServices.reduce(
  (sum, service) => sum + service.durationMinutes,
  0
  )

  const requiredSlots = Math.ceil(totalDuration / 60)

  const selectedTimes = Object.values(selectedSlots)
  .filter(Boolean)
  .map(s => s!.slot.dateStart)

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
            <h2 className='text-[var(--color-icon)] text-[16px] font-semibold font-[Inter]'>{employeeServices[0].parentCategoryLabel} služby:</h2>

            {employeeServices.map(service => (
              <div key={service.id}>
                <div className='text-[var(--color-icon)] text-[16px]'>{service.title}</div>
                <div className='flex justify-between mb-[var(--space-sm)]'>
                  <span className='text-[var(--color-border)]'>{formatDurationCsShort(service.durationMinutes)}</span>
                  <span className='text-[var(--color-icon)] text-[16px]'>{service.price} Kč</span>
                </div>
              </div>
            ))}

            <div className='flex justify-between mb-[var(--space-xl)]'>
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