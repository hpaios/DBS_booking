import { useTimeSlots } from '../../api/hooks/useTimeslots'
import type { ApiTimeSlot, Service, WeekScheduleItem } from '../../interfaces'
import { getUniqueParentCategoryIds } from '../../utils'
import ServicesCalendar from './ServicesCalendar'

const SelectSlot = ({selectedServices, weekSchedule}: {
  selectedServices: Service[]
  weekSchedule: WeekScheduleItem[]
}) => {
  const uniqueParentCategoryIds = getUniqueParentCategoryIds(selectedServices)

  const { timeSlots } = useTimeSlots(uniqueParentCategoryIds);

  const servicesTimeSlots = Object.keys(timeSlots);

  return (
    <div className="flex flex-col gap-8">
      {weekSchedule && servicesTimeSlots.map((employeeId) => (
        <ServicesCalendar
          key={employeeId}
          weekSchedule={weekSchedule}
          slots={timeSlots[Number(employeeId)] as unknown as ApiTimeSlot[]}
        />
      ))}
    </div>
  )
}

export default SelectSlot