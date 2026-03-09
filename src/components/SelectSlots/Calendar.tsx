const Calendar = ({
  days,
  selectedDate,
  onSelect,
}: {
  days: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`px-3 py-2 border rounded
          ${
            selectedDate === day
              ? "border-[var(--color-primary)]"
              : "border-[var(--color-border)]"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default Calendar;
