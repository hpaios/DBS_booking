import Calendar from './Calendar'
import SlotsList from './SlotsList'
import { mapSlotsByDays, normalizeSlotsBySchedule } from '../../utils'
import type { ApiTimeSlot, SelectedSlot, WeekScheduleItem } from '../../interfaces'

const ServicesCalendar = ({
  slots,
  weekSchedule,
  selectedSlot,
  selectedDate,
  onSelectSlot,
  onSelectDate
}: {
  slots: ApiTimeSlot[]
  weekSchedule: WeekScheduleItem[]
  selectedSlot: SelectedSlot | null
  selectedDate: string
  onSelectSlot: (slot: ApiTimeSlot, date: string) => void
  onSelectDate: (date: string) => void
}) => {

  const normalizedSlots = normalizeSlotsBySchedule(
  slots,
  weekSchedule
);

  const calendar = mapSlotsByDays(normalizedSlots);

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
        selectedSlot={selectedSlot && selectedSlot.slot}
        onSelectSlot={(slot) => onSelectSlot(slot, selectedDate)}
      />
    </div>
  );
};

export default ServicesCalendar;
