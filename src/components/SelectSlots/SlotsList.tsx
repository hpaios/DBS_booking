import type { ApiTimeSlot } from '../../interfaces'
import { getOccupiedSlotStarts } from '../../utils'
import { slotStyle } from './SelectSlot.style'

const SlotsList = ({
  slots,
  selectedTimes,
  currentEmployeeSelectedTimes,
  requiredSlots,
  selectedSlot,
  onSelectSlot
}: {
  selectedTimes: string[]
  currentEmployeeSelectedTimes: string[]
  requiredSlots: number
  slots: {
    morning: ApiTimeSlot[]
    afternoon: ApiTimeSlot[]
  }
  selectedSlot: ApiTimeSlot | null
  onSelectSlot: (slot: ApiTimeSlot) => void
}) => {
  const isSlotDisabled = (slot: ApiTimeSlot) => {
    const candidateTimes = getOccupiedSlotStarts(slot.dateStart, requiredSlots)

    return candidateTimes.some(
      (time) =>
        selectedTimes.includes(time) &&
        !currentEmployeeSelectedTimes.includes(time)
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {slots.morning.length > 0 && (
        <div>
          <div className="mb-[var(--space-sm)] text-[var(--color-icon)] font-semibold">
            Ráno
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            {slots.morning.map((slot) => {
              const isDisabled = isSlotDisabled(slot)

              return (
                <button
                  key={slot.dateStart}
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot)}
                  className={`${slotStyle} ${
                    selectedSlot?.dateStart === slot.dateStart
                      ? 'bg-[var(--color-icon)] text-[var(--color-gray)]'
                      : 'bg-transparent text-[var(--color-icon)] disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {slot.dateStart.slice(11, 16)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {slots.afternoon.length > 0 && (
        <div>
          <div className="mb-[var(--space-sm)] text-[var(--color-icon)] font-semibold">
            Odpoledne
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            {slots.afternoon.map((slot) => {
              const isDisabled = isSlotDisabled(slot)

              return (
                <button
                  key={slot.dateStart}
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot)}
                  className={`${slotStyle} ${
                    selectedSlot?.dateStart === slot.dateStart
                      ? 'bg-[var(--color-icon)] text-[var(--color-gray)]'
                      : 'bg-transparent text-[var(--color-icon)] disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {slot.dateStart.slice(11, 16)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SlotsList