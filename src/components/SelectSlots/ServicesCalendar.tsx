import { useState } from "react";
import Calendar from './Calendar'
import SlotsList from './SlotsList'
import { mapSlotsByDays, normalizeSlotsBySchedule } from '../../utils'
import type { ApiTimeSlot, WeekScheduleItem } from '../../interfaces'

const ServicesCalendar = ({
  slots,
  weekSchedule,
  selectedSlot,
  onSelectSlot
}: {
  slots: ApiTimeSlot[]
  weekSchedule: WeekScheduleItem[]
  selectedSlot: ApiTimeSlot | null
  onSelectSlot: (slot: ApiTimeSlot) => void
}) => {

  const normalizedSlots = normalizeSlotsBySchedule(
  slots,
  weekSchedule
);

  const calendar = mapSlotsByDays(normalizedSlots);

  const [selectedDate, setSelectedDate] = useState(Object.keys(calendar)[0]);

  const daySlots = calendar[selectedDate];

  return (
    <div className="flex flex-col gap-4 p-4 rounded">
      <Calendar
        calendar={calendar}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <SlotsList
        slots={daySlots}
        selectedSlot={selectedSlot}
        onSelectSlot={onSelectSlot}
      />
    </div>
  );
};

export default ServicesCalendar;
