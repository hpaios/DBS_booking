import type { DaySlots } from '../../interfaces'
import { formatIsoDateCs } from '../../utils'

const Calendar = ({
  calendar,
  selectedDate,
  onSelect,
}: {
  calendar: Record<string, DaySlots>;
  selectedDate: string;
  onSelect: (date: string) => void;
}) => {
  const days = Object.keys(calendar)
  return (
    <div className="flex gap-[10px] overflow-x-auto">
      {days.map((day) => {

        const formatted = formatIsoDateCs(day);
        const isDisabled = calendar[day].afternoon.length === 0 && calendar[day].morning.length === 0

        const getDateClass = (isSelected: boolean, isDisabled: boolean) => {
          if (isDisabled) return "text-[var(--color-disabled-text)]";
          return isSelected ? "text-[var(--color-gray)]" : "text-[var(--color-icon)]";
        };

        return(
          <button
            key={day}
            onClick={() => onSelect(day)}
            disabled={isDisabled}
            className={`border rounded text-[var(--color-icon)] flex gap-[10px] flex-col p-[var(--space-lg)] rounded-[1rem] cursor-pointer hover:border-[var(--color-icon)]
            disabled:bg-[var(--color-disabled)] 
            disabled:cursor-not-allowed 
            disabled::border-[var(--color-disabled)]
            disabled:hover:border-[var(--color-gray)]
            ${
              selectedDate === day
                ? "border-[var(--color-icon)]"
                : "border-[var(--color-gray)]"
            }
            ${
              selectedDate === day
                ? "bg-[var(--color-icon)]"
                : "bg-transparent"
            }
          `}
          >
            <div className={getDateClass(selectedDate === day && !isDisabled, isDisabled)}>
              {formatted.weekday.toLowerCase()}
            </div>
            <div className={getDateClass(selectedDate === day && !isDisabled, isDisabled)}>
              {formatted.day}
            </div>
            <div className={getDateClass(selectedDate === day && !isDisabled, isDisabled)}>
              {formatted.month}
            </div>
          </button>
        )})}
    </div>
  );
};

export default Calendar;
