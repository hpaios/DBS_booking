import { useState } from "react";
import Calendar from './Calendar'
import SlotsList from './SlotsList'
import { mapSlotsByDays, normalizeSlotsBySchedule } from '../../utils'
import type { ApiTimeSlot, WeekScheduleItem } from '../../interfaces'

const ServicesCalendar = ({
  slots,
  weekSchedule
}: {
  slots: ApiTimeSlot[];
  weekSchedule: WeekScheduleItem[]
}) => {

  // const filteredSlots = filterSlotsBySchedule(slots, weekSchedule);

  // const calendar = mapSlotsByDays(filteredSlots);

  const normalizedSlots = normalizeSlotsBySchedule(
  slots,
  weekSchedule
);

 console.log('normalizedSlots', normalizedSlots);

  const calendar = mapSlotsByDays(normalizedSlots);

  const [selectedDate, setSelectedDate] = useState(Object.keys(calendar)[0]);

  const daySlots = calendar[selectedDate];

  return (
    <div className="flex flex-col gap-4 border p-4 rounded">
      <Calendar
        days={Object.keys(calendar)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <SlotsList slots={daySlots} />
    </div>
  );
};

export default ServicesCalendar;
