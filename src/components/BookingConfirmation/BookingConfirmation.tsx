import { useState } from "react"
import ReCAPTCHA from "react-google-recaptcha";
import IntlTelInput from "intl-tel-input/reactWithUtils"
import "intl-tel-input/build/css/intlTelInput.css"
import type { SelectedSlot, Service } from "../../interfaces"
import { createAppointment } from '../../api/api/requests'
import { groupServicesToArray, subtractHour } from '../../utils'
import { btnSubmitStyle, inputClass, wrapperClass } from './BookingConfirmation.style'
import SummaryOrder from './SummaryOrder'

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
  const [isRecaptcaValid, setIsRecaptcaValid] = useState(false)

  const [touched, setTouched] = useState(false)

  const isValidEmail = /\S+@\S+\.\S+/.test(email)
  const isValidName = name.trim().length > 1

  const hasCategoryAutoservice = selectedServices.some(
  service => service.parentCategoryId === 308291
  )
  const isValidVin = hasCategoryAutoservice ? (vin.trim().length >= 6) : true

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

      const commentWithVin = vin.length ? `VIN: ${vin}
      comment: ${comment}` : comment

      return createAppointment({
        name,
        phone: phoneNumber,
        vin,
        comment: commentWithVin,
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

  const services = groupServicesToArray(selectedServices)

  const onChangeRecaptcha = (value: string | null) => {
    setIsRecaptcaValid(!!value)
  }

  return (
    <div className="space-y-4">
      {<SummaryOrder services={services} />}
      <div className="flex justify-between pt-[var(--space-sm)] mt-[var(--space-md)]">
      </div>
      <div className={wrapperClass}>
        <input
          type="text"
          placeholder="Jméno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
        {touched && !isValidName && (
          <p className="text-[var(--color-red)] absolute text-[10px] left-[10px] -bottom-[1rem]">Zadejte své jméno</p>
        )}
      </div>

      <div className={wrapperClass}>
        <IntlTelInput
          onChangeNumber={setNumber}
          onChangeValidity={setIsValidPhone}
          initOptions={{
            initialCountry: "cz",
            nationalMode: false,
            separateDialCode: false,
          }}
          inputProps={{
            className: inputClass,
            onBlur: () => setTouched(true),
            placeholder: "Telefon"
          }}
        />
        {touched && !isValidPhone && (
          <p className="text-[var(--color-red)] absolute text-[10px] left-[10px] -bottom-[1rem]">Neplatné telefonní číslo</p>
        )}
      </div>

      <div className={wrapperClass}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
        {touched && !isValidEmail && (
          <p className="text-[var(--color-red)] absolute text-[10px] left-[10px] -bottom-[1rem]">Neplatný e-mail</p>
        )}
      </div>

      <div className={wrapperClass}>
        <input
          type="text"
          placeholder="Číslo VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputClass}
        />
        {touched && !isValidVin && (
          <p className="text-[var(--color-red)] absolute text-[10px] left-[10px] -bottom-[1rem]">Zadejte číslo VIN</p>
        )}
      </div>

      <div className={wrapperClass}>
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`${inputClass} resize-none h-[60px]`}
        />
      </div>
      
      <div className='flex w-full justify-center'>
         <ReCAPTCHA
          sitekey='6LeP2Y4sAAAAAL33B9ibyhVWlUNb8VAMBvJlMzRI'
          onChange={(value: string | null) => onChangeRecaptcha(value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || !isRecaptcaValid}
        className={btnSubmitStyle}
      >
        Odeslat
      </button>
    </div>
  )
}

export default BookingConfirmation