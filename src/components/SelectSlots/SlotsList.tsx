import type { ApiTimeSlot } from '../../interfaces'
import { slotStyle } from './SelectSlot.style'

const SlotsList = ({
  slots,
  selectedTimes,
  selectedSlot,
  onSelectSlot
}: {
  selectedTimes: string[]
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
            {slots.morning.map((slot) => {
              const isDisabled = selectedTimes.includes(slot.dateStart) && selectedSlot?.dateStart !== slot.dateStart
              return (
                <button
                  key={slot.dateStart}
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot)}
                  className={`${slotStyle} ${
                    selectedSlot?.dateStart === slot.dateStart
                      ? "bg-[var(--color-icon)] text-[var(--color-gray)]"
                      : "bg-transparent text-[var(--color-icon)] disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                {slot.dateStart.slice(11,16)}
              </button>
              )
            })}
          </div>
        </div>
      )}

      {slots.afternoon.length > 0 && (
        <div>
          <h4 className="mb-2">Odpoledne</h4>
          <div className="grid grid-cols-3 gap-[10px]">
            {slots.afternoon.map((slot) => {
              const isDisabled = selectedTimes.includes(slot.dateStart) && selectedSlot?.dateStart !== slot.dateStart
              return (
                <button
                  key={slot.dateStart}
                  onClick={() => onSelectSlot(slot)}
                  disabled={isDisabled}
                  className={`${slotStyle} ${
                    selectedSlot?.dateStart === slot.dateStart
                      ? "bg-[var(--color-icon)] text-[var(--color-gray)]"
                      : "bg-transparent text-[var(--color-icon)]  disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {slot.dateStart.slice(11,16)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsList;