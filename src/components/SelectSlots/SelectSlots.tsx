import { useTimeSlots } from '../../api/hooks/useTimeslots'
import type { ApiTimeSlot, Service, WeekScheduleItem } from '../../interfaces'
import { formatDurationCsShort, getUniqueParentCategoryIds } from '../../utils'
import ServicesCalendar from './ServicesCalendar'

const SelectSlot = ({selectedServices, weekSchedule, selectedSlots, onSelectSlot}: {
  selectedServices: Service[]
  weekSchedule: WeekScheduleItem[]
  selectedSlots: Record<number, ApiTimeSlot | null>
  onSelectSlot: (employeeId: number, slot: ApiTimeSlot) => void
}) => {
  const uniqueParentCategoryIds = getUniqueParentCategoryIds(selectedServices)

  const { timeSlots } = useTimeSlots(uniqueParentCategoryIds);

  const servicesTimeSlots = Object.keys(timeSlots);

  return (
    <div className="flex flex-col gap-8">
      {weekSchedule && servicesTimeSlots.map((employeeId) => {

        const employeeServices = selectedServices.filter(
          service => service.parentCategoryId === Number(employeeId)
        );

        const totalPrice = employeeServices.reduce(
          (sum, service) => sum + service.price,
          0
        );

        return (
          <div key={employeeId}>
            <h2>{employeeServices[0].parentCategoryLabel} služby:</h2>

            {employeeServices.map(service => (
              <div key={service.id}>
                <div className='mb-[var(--space-sm)]'>{service.title}</div>
                <div className='flex justify-between mb-[var(--space-sm)]'>
                  <span>{formatDurationCsShort(service.durationMinutes)}</span>
                  <span>{service.price} Kč</span>
                </div>
              </div>
            ))}

            <div className='flex justify-between mb-[var(--space-xl)]'>
              <span>Celkem: </span>
              <span>{totalPrice} Kč</span>
            </div>

            <ServicesCalendar
              weekSchedule={weekSchedule}
              slots={timeSlots[Number(employeeId)] as unknown as ApiTimeSlot[]}
              selectedSlot={selectedSlots[Number(employeeId)]}
              onSelectSlot={(slot) => onSelectSlot(Number(employeeId), slot)}
            />
          </div>
        );
      })}
    </div>
  )
}

export default SelectSlot