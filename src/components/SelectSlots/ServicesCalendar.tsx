import { useTranslation } from 'react-i18next'
import Calendar from './Calendar'
import SlotsList from './SlotsList'
import type { ApiTimeSlot, DaySlots, SelectedSlot } from '../../interfaces'

const ServicesCalendar = ({
  calendar,
  selectedTimes,
  currentEmployeeSelectedTimes,
  requiredSlots,
  selectedSlot,
  selectedDate,
  onSelectSlot,
  onSelectDate
}: {
  calendar: Record<string, DaySlots>
  selectedSlot: SelectedSlot | null
  selectedDate: string
  selectedTimes: string[]
  currentEmployeeSelectedTimes: string[]
  requiredSlots: number
  onSelectSlot: (slot: ApiTimeSlot, date: string) => void
  onSelectDate: (date: string) => void
}) => {
  const daySlots = calendar[selectedDate]
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <Calendar
        calendar={calendar}
        selectedDate={selectedDate}
        onSelect={onSelectDate}
      />

      <span className="text-[var(--color-gray)] text-[14px] block text-center">
        {t('common.time_zone')}
      </span>

      <SlotsList
        slots={daySlots}
        selectedTimes={selectedTimes}
        currentEmployeeSelectedTimes={currentEmployeeSelectedTimes}
        requiredSlots={requiredSlots}
        selectedSlot={selectedSlot && selectedSlot.slot}
        onSelectSlot={(slot) => onSelectSlot(slot, selectedDate)}
      />
    </div>
  )
}

export default ServicesCalendar
