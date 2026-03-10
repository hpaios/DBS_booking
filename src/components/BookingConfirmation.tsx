import type { SelectedSlot, Service } from '../interfaces'

const BookingConfirmation = ({selectedServices, selectedSlots, selectedDates}: {
  selectedServices: Service[]
  selectedSlots: Record<number, SelectedSlot | null>
  selectedDates: Record<number, string>
}) => {
  console.log('selectedServices', selectedServices)
  console.log('selectedSlots', selectedSlots)
  console.log('selectedDates', selectedDates)
  return (
    <div>BookingConfirmation</div>
  )
}

export default BookingConfirmation