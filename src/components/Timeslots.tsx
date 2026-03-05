import { useMemo } from "react";
import type { Timeslot, TimeslotsProps } from '../interfaces'
import { afternoonSlots, morningSlots } from '../config'


const Timeslots = ({ date, onSelect, selectedSlot }: TimeslotsProps) => {
  const now = new Date();

  const filteredSlots = useMemo(() => {
    const isToday = date === now.toISOString().split("T")[0];

    const filterFn = (slot: Timeslot) => {
      if (!isToday) return true;

      // для сьогоднішнього дня фільтруємо пройдені слоти
      const [hours, minutes] = slot.split(":").map(Number);
      const slotDate = new Date(now);
      slotDate.setHours(hours, minutes, 0, 0);

      return slotDate > now;
    };

    return {
      morning: morningSlots.filter(filterFn),
      afternoon: afternoonSlots.filter(filterFn),
    };
  }, [date, now]);

  const renderSlots = (slots: Timeslot[]) =>
    slots.map((slot) => (
      <button
        key={slot}
        onClick={() => onSelect(slot)}
        className={`px-3 py-2 rounded border mr-2 mb-2 cursor-pointer ${
          slot === selectedSlot ? "bg-blue-500 text-white" : "bg-white border-gray-300"
        }`}
      >
        {slot}
      </button>
    ));

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Ráno</h3>
        <div className="flex flex-wrap">{renderSlots(filteredSlots.morning)}</div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Odpoledne</h3>
        <div className="flex flex-wrap">{renderSlots(filteredSlots.afternoon)}</div>
      </div>
    </div>
  );
};

export default Timeslots;
