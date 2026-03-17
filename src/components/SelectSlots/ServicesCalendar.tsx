import Calendar from './Calendar'
import SlotsList from './SlotsList'
import type { ApiTimeSlot, DaySlots, SelectedSlot } from '../../interfaces'

const ServicesCalendar = ({
  calendar,
  selectedTimes,
  selectedSlot,
  selectedDate,
  onSelectSlot,
  onSelectDate
}: {
  calendar: Record<string, DaySlots>
  selectedSlot: SelectedSlot | null
  selectedDate: string
  selectedTimes: string[]
  onSelectSlot: (slot: ApiTimeSlot, date: string) => void
  onSelectDate: (date: string) => void
}) => {

  const daySlots = calendar[selectedDate];

  return (
    <div className={"flex flex-col gap-4"}>
      <Calendar
        calendar={calendar}
        selectedDate={selectedDate}
        onSelect={onSelectDate}
      />
      <span className='text-[var(--color-gray)] text-[14px] block text-center'>Čas je zobrazen pro časové pásmo: Europe/Prague</span>
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
