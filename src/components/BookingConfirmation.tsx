import { useState } from 'react'
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/build/css/intlTelInput.css";
import type { SelectedSlot, Service } from '../interfaces'

const BookingConfirmation = ({selectedServices, selectedSlots, selectedDates}: {
  selectedServices: Service[]
  selectedSlots: Record<number, SelectedSlot | null>
  selectedDates: Record<number, string>
}) => {
  const [phoneNumber, setNumber] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [touched, setTouched] = useState(false)
  console.log('selectedServices', selectedServices)
  console.log('selectedSlots', selectedSlots)
  console.log('selectedDates', selectedDates)

  const handleSubmit = () => {
    setTouched(true)

    if (!isValid || !phoneNumber) {
      return
    }
  }

  return (
    <div>
      BookingConfirmation
      <br />
      <br />
      <div className="w-full">
        <div
          className={`
            w-full border rounded-[1rem] py-[var(--space-lg)] cursor-pointer transition
            ${touched && !isValid
              ? "border-red-500"
              : "border-[var(--color-gray)] hover:border-[var(--color-icon)] focus-within:border-[var(--color-icon)]"}
          `}
        >
          <IntlTelInput
            onChangeNumber={setNumber}
            onChangeValidity={setIsValid}
            initOptions={{
              initialCountry: "cz",
            }}
            inputProps={{
              className:
                "w-full outline-none bg-transparent text-[var(--color-icon)] px-[var(--space-md)] border-none",
              onBlur: () => setTouched(true)
            }}
          />
        </div>

        {touched && !isValid && (
          <p className="text-[var(--color-red)] text-sm mt-2">
            Invalid phone number
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="mt-6 px-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
      >
        Confirm booking
      </button>
    </div>
  )
}

export default BookingConfirmation