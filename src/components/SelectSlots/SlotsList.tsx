import type { ApiTimeSlot } from '../../interfaces'
import { slotStyle } from './SelectSlot.style'

const SlotsList = ({
  slots,
  selectedSlot,
  onSelectSlot
}: {
  slots: {
    morning: ApiTimeSlot[];
    afternoon: ApiTimeSlot[];
  };
  selectedSlot: ApiTimeSlot | null;
  onSelectSlot: (slot: ApiTimeSlot) => void;
}) => {
  return (
    <div className="flex flex-col gap-6">
      {slots.morning.length > 0 && (
        <div>
          <h4 className="mb-2">Ráno</h4>
          <div className="grid grid-cols-3 gap-[10px]">
            {slots.morning.map((slot) => (
              <button
                key={slot.dateStart}
                onClick={() => onSelectSlot(slot)}
                className={`${slotStyle} ${
                  selectedSlot?.dateStart === slot.dateStart
                    ? "bg-[var(--color-icon)] text-[var(--color-gray)]"
                    : "bg-transparent text-[var(--color-icon)]"
                }`}
              >
                {slot.dateStart.slice(11,16)}
              </button>
            ))}
          </div>
        </div>
      )}

      {slots.afternoon.length > 0 && (
        <div>
          <h4 className="mb-2">Odpoledne</h4>
          <div className="grid grid-cols-3 gap-[10px]">
            {slots.afternoon.map((slot) => (
              <button
                key={slot.dateStart}
                onClick={() => onSelectSlot(slot)}
                className={`${slotStyle} ${
                  selectedSlot?.dateStart === slot.dateStart
                    ? "bg-[var(--color-icon)] text-[var(--color-gray)]"
                    : "bg-transparent text-[var(--color-icon)]"
                }`}
              >
                {slot.dateStart.slice(11,16)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsList;