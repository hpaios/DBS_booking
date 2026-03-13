import Calendar from './Calendar'
import SlotsList from './SlotsList'
import { mapSlotsByDays, normalizeSlotsBySchedule } from '../../utils'
import type { ApiTimeSlot, DaySlots, SelectedSlot, WeekScheduleItem } from '../../interfaces'

const ServicesCalendar = ({
  slots,
  weekSchedule,
  calendar,
  selectedTimes,
  selectedSlot,
  selectedDate,
  onSelectSlot,
  onSelectDate
}: {
  slots?: ApiTimeSlot[]
  weekSchedule?: WeekScheduleItem[]
  calendar: Record<string, DaySlots>
  selectedSlot: SelectedSlot | null
  selectedDate: string
  selectedTimes: string[]
  onSelectSlot: (slot: ApiTimeSlot, date: string) => void
  onSelectDate: (date: string) => void
}) => {

  const daySlots = calendar[selectedDate];

  return (
    <div className="flex flex-col gap-4 p-4 rounded">
      <Calendar
        calendar={calendar}
        selectedDate={selectedDate}
        onSelect={onSelectDate}
      />

      <SlotsList
        slots={daySlots}
        selectedTimes={selectedTimes}
        selectedSlot={selectedSlot && selectedSlot.slot}
        onSelectSlot={(slot) => onSelectSlot(slot, selectedDate)}
      />
    </div>
  );
};

export default ServicesCalendar;
