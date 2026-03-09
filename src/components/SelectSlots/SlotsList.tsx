import type { ApiTimeSlot } from '../../interfaces'

const SlotsList = ({
  slots,
}: {
  slots: {
    morning: ApiTimeSlot[];
    afternoon: ApiTimeSlot[];
  };
}) => {
  return (
    <div className="flex flex-col gap-6">
      {slots.morning.length > 0 && (
        <div>
          <h4 className="mb-2">Утро</h4>
          <div className="flex flex-wrap gap-2">
            {slots.morning.map((slot) => (
              <button
                key={slot.dateStart}
                className="border px-3 py-2 rounded"
              >
                {slot.dateStart.slice(11,16)}
              </button>
            ))}
          </div>
        </div>
      )}

      {slots.afternoon.length > 0 && (
        <div>
          <h4 className="mb-2">День</h4>
          <div className="flex flex-wrap gap-2">
            {slots.afternoon.map((slot) => (
              <button
                key={slot.dateStart}
                className="border px-3 py-2 rounded"
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