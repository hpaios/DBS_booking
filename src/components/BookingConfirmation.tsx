import { useState } from "react"
import IntlTelInput from "intl-tel-input/reactWithUtils"
import "intl-tel-input/build/css/intlTelInput.css"
import type { SelectedSlot, Service } from "../interfaces"
import { createAppointment } from '../api/api/requests'

const BookingConfirmation = ({
  selectedServices,
  selectedSlots,
  currentStep,
  setCurrentStep
}: {
  selectedServices: Service[]
  selectedSlots: Record<number, SelectedSlot | null>
  selectedDates: Record<number, string>
  currentStep: number
  setCurrentStep: (step: number) => void
}) => {

  const [phoneNumber, setNumber] = useState<string | null>(null)
  const [isValidPhone, setIsValidPhone] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [vin, setVin] = useState("")
  const [comment, setComment] = useState("")

  const [touched, setTouched] = useState(false)

  const isValidEmail = /\S+@\S+\.\S+/.test(email)
  const isValidName = name.trim().length > 1
  const isValidVin = vin.trim().length >= 6

  const isFormValid =
    isValidPhone &&
    isValidEmail &&
    isValidName &&
    isValidVin


  const getDateStart = (dateEnd: string, duration: number) => {
    const [datePart, timePart] = dateEnd.split("T")
    const [year, month, day] = datePart.split("-").map(Number)
    const [hour, minute] = timePart.split(":").map(Number)

    // Создаем Date в локальном времени
    const dateStart = new Date(year, month - 1, day, hour, minute)
    dateStart.setMinutes(dateStart.getMinutes() - duration) // прибавляем 60 минут

    // Форматируем обратно в ISO без пересчета UTC
    const pad = (n: number) => n.toString().padStart(2, "0")
    const dateStartISO =
      `${dateStart.getFullYear()}-${pad(dateStart.getMonth() + 1)}-${pad(dateStart.getDate())}T${pad(dateStart.getHours())}:${pad(dateStart.getMinutes())}:${pad(dateStart.getSeconds())}Z`

    return dateStartISO;
  }


  const handleSubmit = async () => {
  setTouched(true)

  if (!isFormValid || !phoneNumber) return

    const dateEnd = selectedSlots[selectedServices[0]?.parentCategoryId]?.slot.dateStart as string;

    // TODO: IMPORTANT - при букинге в crm запись идет на +1 час
    // винужденная мера вот таким костылем задавать время на -1час
    const dateStart = getDateStart(dateEnd, 60)

    const { data } = await createAppointment({
      name,
      phone: phoneNumber,
      vin,
      comment,
      employeeId: selectedServices[0]?.parentCategoryId,
      serviceIds: selectedServices.map(s => s.id),
      // @ts-ignore
      dateStart: dateStart,
      // @ts-ignore
      dateEnd: dateEnd
    })

    if (data && data.hash) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  console.log('selectedServices', selectedServices)
  console.log('selectedSlots', selectedSlots)

  const inputClass =
    "w-full outline-none bg-transparent text-[var(--color-icon)] px-[var(--space-md)] py-[var(--space-lg)] border-none"

  const wrapperClass =
    "w-full border rounded-[1rem] transition border-[var(--color-gray)] hover:border-[var(--color-icon)] focus-within:border-[var(--color-icon)] my-[1rem]"

  return (
    <div className="space-y-4">
      <div className='my-[1rem]'>
        {selectedServices[0]?.parentCategoryLabel}
      </div>
      <div className='my-[1rem]'>{selectedServices[0]?.title}</div>

      <div className={wrapperClass}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
      </div>

      {touched && !isValidName && (
        <p className="text-[var(--color-red)] text-sm">Enter your name</p>
      )}

      <div className={wrapperClass}>
        <IntlTelInput
          onChangeNumber={setNumber}
          onChangeValidity={setIsValidPhone}
          initOptions={{ initialCountry: "cz" }}
          inputProps={{
            className: inputClass,
            onBlur: () => setTouched(true),
            placeholder: "Phone number"
          }}
        />
      </div>

      {touched && !isValidPhone && (
        <p className="text-[var(--color-red)] text-sm">Invalid phone number</p>
      )}

      <div className={wrapperClass}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
      </div>

      {touched && !isValidEmail && (
        <p className="text-[var(--color-red)] text-sm">Invalid email</p>
      )}

      <div className={wrapperClass}>
        <input
          type="text"
          placeholder="VIN number"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
      </div>

      {touched && !isValidVin && (
        <p className="text-[var(--color-red)] text-sm">Enter VIN number</p>
      )}

      <div className={wrapperClass}>
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`${inputClass} resize-none h-[60px]`}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="mt-4 w-full px-[1rem] py-3 bg-black text-white rounded-xl disabled:opacity-50"
      >
        Confirm booking
      </button>
    </div>
  )
}

export default BookingConfirmation