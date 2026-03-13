import { useState } from "react"
import IntlTelInput from "intl-tel-input/reactWithUtils"
import "intl-tel-input/build/css/intlTelInput.css"
import type { SelectedSlot, Service } from "../interfaces"
import { createAppointment } from '../api/api/requests'
import { subtractHour } from '../utils'

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

  const handleSubmit = async () => {
  setTouched(true)

  if (!isFormValid || !phoneNumber) return

  const requests = Object.entries(selectedSlots)
    .filter(([_, value]) => value?.slot?.dateStart)
    .map(([employeeId, value]) => {

     
      const dateStart = subtractHour(value!.slot.dateStart as string)
      const dateEnd = subtractHour(value!.slot.dateEnd as string)

      const employeeServices = selectedServices.filter(
        s => s.parentCategoryId === Number(employeeId)
      )

      return createAppointment({
        name,
        phone: phoneNumber,
        vin,
        comment,
        employeeId: Number(employeeId),
        serviceIds: employeeServices.map(s => s.id),
        // @ts-ignore
        dateStart,
        // @ts-ignore
        dateEnd
      })
    })

  const responses = await Promise.all(requests)

  const success = responses.every(res => res?.data?.hash)

  if (success) {
    setCurrentStep(currentStep + 1)
  }
}


  // const handleSubmit = async () => {
  // setTouched(true)

  // if (!isFormValid || !phoneNumber) return

  //   const dateEnd = selectedSlots[selectedServices[0]?.parentCategoryId]?.slot.dateStart as string;

  //   // TODO: IMPORTANT - при букинге в crm запись идет на +1 час
  //   // винужденная мера вот таким костылем задавать время на -1час
  //   const dateStart = getDateStart(dateEnd, 60)

  //   const { data } = await createAppointment({
  //     name,
  //     phone: phoneNumber,
  //     vin,
  //     comment,
  //     employeeId: selectedServices[0]?.parentCategoryId,
  //     serviceIds: selectedServices.map(s => s.id),
  //     // @ts-ignore
  //     dateStart: dateStart,
  //     // @ts-ignore
  //     dateEnd: dateEnd
  //   })

  //   if (data && data.hash) {
  //     setCurrentStep(currentStep + 1)
  //   }
  // }
  
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