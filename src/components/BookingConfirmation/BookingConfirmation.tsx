import { useState } from "react"
import ReCAPTCHA from "react-google-recaptcha";
import IntlTelInput from "intl-tel-input/reactWithUtils"
import "intl-tel-input/build/css/intlTelInput.css"
import type { SelectedSlot, Service } from "../../interfaces"
import { createAppointment, getOrCreateClient, sendBookingConfirmation } from '../../api/api/requests'
import { addMinutes, groupServicesToArray, subtractTwoHours } from '../../utils'
import { RECAPTCHA_PROD } from '../../config'
import { btnSubmitStyle, inputClass, wrapperClass } from './BookingConfirmation.style'
import SummaryOrder from './SummaryOrder'

const BookingConfirmation = ({
  selectedServices,
  selectedSlots,
  setCurrentStep,
  handleIsErrorSubmit
}: {
  selectedServices: Service[]
  selectedSlots: Record<number, SelectedSlot | null>
  selectedDates: Record<number, string>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  handleIsErrorSubmit: React.Dispatch<React.SetStateAction<boolean>>
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

  // const handleSubmit = async () => {
  // setTouched(true)

  // if (!isFormValid || !phoneNumber) return


  // const clientRes = await createClient({
  //   first_name: name,
  //   phone: phoneNumber,
  //   email,
  // })

  // const clientId = clientRes?.data?.id

  // if (!clientId) {
  //   handleIsErrorSubmit(true)
  //   return
  // }

  // const requests = Object.entries(selectedSlots)
  //   .filter(([_, value]) => value?.slot?.dateStart)
  //   .map(([employeeId, value]) => {

  //     // WINTER TIME
  //     // const dateStart = subtractHour(value!.slot.dateStart as string)
  //     // const dateEnd = subtractHour(value!.slot.dateEnd as string)

  //     // SUMMER TIME
  //     const dateStart = subtractTwoHours(value!.slot.dateStart as string)
  //     // const dateEnd = subtractTwoHours(value!.slot.dateEnd as string)

  //     // const dateStart = value!.slot.dateStart as string

  //     const employeeServices = selectedServices.filter(
  //       s => s.parentCategoryId === Number(employeeId)
  //     )

  //     const employeeTotalDuration = employeeServices.reduce(
  //       (sum, service) => sum + service.durationMinutes,
  //       0
  //       )

  //     const dateEnd = addMinutes(dateStart, employeeTotalDuration);

  //     const commentWithVin = vin.length ? `VIN: ${vin}
  //     comment: ${comment}` : comment

  //     return createAppointment({
  //       name,
  //       phone: phoneNumber,
  //       vin,
  //       comment: commentWithVin,
  //       employeeId: Number(employeeId),
  //       serviceIds: employeeServices.map(s => s.id),
  //       dateStart,
  //       dateEnd
  //     })
  //   })

  // const responses = await Promise.all(requests)

  // const success = responses.every(res => res?.data?.hash)

  //   if (success) {
  //     setCurrentStep(prev => prev + 1)
  //   }

  //   if (!success) {
  //     handleIsErrorSubmit(true)
  //     setCurrentStep(prev => prev + 2)
  //   }
  // }

  // const handleSubmit = async () => {
  //   setTouched(true)
  
  //   if (!isFormValid || !phoneNumber) return
  
  //   const clientId = await getOrCreateClient({
  //     first_name: name,
  //     phone: phoneNumber,
  //     email,
  //   })
  
  //   if (!clientId) {
  //     handleIsErrorSubmit(true)
  //     return
  //   }
  
  //   const requests = Object.entries(selectedSlots)
  //     .filter(([_, value]) => value?.slot?.dateStart)
  //     .map(([employeeId, value]) => {
  //       const dateStart = subtractTwoHours(value!.slot.dateStart as string)
  
  //       const employeeServices = selectedServices.filter(
  //         s => s.parentCategoryId === Number(employeeId)
  //       )
  
  //       const employeeTotalDuration = employeeServices.reduce(
  //         (sum, service) => sum + service.durationMinutes,
  //         0
  //       )
  
  //       const dateEnd = addMinutes(dateStart, employeeTotalDuration)
  
  //       const commentWithVin = vin.length
  //         ? `VIN: ${vin}\ncomment: ${comment}`
  //         : comment
  
  //       return createAppointment({
  //         clientId,
  //         name,
  //         phone: phoneNumber,
  //         vin,
  //         comment: commentWithVin,
  //         employeeId: Number(employeeId),
  //         serviceIds: employeeServices.map(s => s.id),
  //         dateStart,
  //         dateEnd,
  //       })
  //     })

  //   const responses = await Promise.allSettled(requests)

  //   responses.forEach((res, index) => {
  //     if (res.status === 'rejected') {
  //       console.error(`Request ${index} failed:`, res.reason)
  //     }
  //   })

  //   const success = responses.every(res => res.status === 'fulfilled')
  
  //   if (success) {
  //     setCurrentStep(prev => prev + 1)
  //   } else {
  //     handleIsErrorSubmit(true)
  //     setCurrentStep(prev => prev + 2)
  //   }
  // }

  // const handleSubmit = async () => {
  //   setTouched(true)
  
  //   if (!isFormValid || !phoneNumber) return
  
  //   const clientId = await getOrCreateClient({
  //     first_name: name,
  //     phone: phoneNumber,
  //     email,
  //   })
  
  //   if (!clientId) {
  //     handleIsErrorSubmit(true)
  //     return
  //   }
  
  //   const requests = Object.entries(selectedSlots)
  //     .filter(([_, value]) => value?.slot?.dateStart)
  //     .map(([employeeId, value]) => {
  //       const dateStart = subtractTwoHours(value!.slot.dateStart as string)
  
  //       const employeeServices = selectedServices.filter(
  //         s => s.parentCategoryId === Number(employeeId)
  //       )
  
  //       const employeeTotalDuration = employeeServices.reduce(
  //         (sum, service) => sum + service.durationMinutes,
  //         0
  //       )
  
  //       const dateEnd = addMinutes(dateStart, employeeTotalDuration)
  
  //       const commentWithVin = vin.length
  //         ? `VIN: ${vin}\ncomment: ${comment}`
  //         : comment
  
  //       return createAppointment({
  //         client: {
  //           name,
  //           phone: phoneNumber,
  //           email,
  //         },
  //         vin,
  //         comment: commentWithVin,
  //         employeeId: Number(employeeId),
  //         serviceIds: employeeServices.map(s => s.id),
  //         dateStart,
  //         dateEnd,
  //       })
  //     })
  
  //   const responses = await Promise.allSettled(requests)
  
  //   const success = responses.every(res => res.status === 'fulfilled')
  
  //   if (success) {
  //     setCurrentStep(prev => prev + 1)
  //   } else {
  //     handleIsErrorSubmit(true)
  //     setCurrentStep(prev => prev + 2)
  //   }
  // }

  const handleSubmit = async () => {
    setTouched(true)
  
    if (!isFormValid || !phoneNumber) return
  
    try {
      const clientId = await getOrCreateClient({
        first_name: name,
        phone: phoneNumber,
        email,
      })
  
      if (!clientId) {
        handleIsErrorSubmit(true)
        return
      }
  
      const requests = Object.entries(selectedSlots)
        .filter(([_, value]) => value?.slot?.dateStart)
        .map(([employeeId, value]) => {
          const dateStart = subtractTwoHours(value!.slot.dateStart as string)
  
          const employeeServices = selectedServices.filter(
            s => s.parentCategoryId === Number(employeeId)
          )
  
          const employeeTotalDuration = employeeServices.reduce(
            (sum, service) => sum + service.durationMinutes,
            0
          )
  
          const dateEnd = addMinutes(dateStart, employeeTotalDuration)
  
          const commentWithVin = vin.length
            ? `VIN: ${vin}\ncomment: ${comment}`
            : comment
  
          return createAppointment({
            client: {
              name,
              phone: phoneNumber,
              email,
            },
            vin,
            comment: commentWithVin,
            employeeId: Number(employeeId),
            serviceIds: employeeServices.map(s => s.id),
            dateStart,
            dateEnd,
          })
        })
  
      const responses = await Promise.allSettled(requests)
      const success = responses.every(res => res.status === 'fulfilled')
  
      if (!success) {
        console.error('Some appointment requests failed:', responses)
        handleIsErrorSubmit(true)
        setCurrentStep(prev => prev + 2)
        return
      }
  
      try {
        const firstSelectedSlot = Object.values(selectedSlots).find(
          value => value?.slot?.dateStart
        )
  
        if (firstSelectedSlot?.slot?.dateStart) {
          const date = new Date(firstSelectedSlot.slot.dateStart)
  
          const bookingDate = new Intl.DateTimeFormat('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(date)
  
          const bookingTime = new Intl.DateTimeFormat('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }).format(new Date(firstSelectedSlot?.slot?.dateStart))

          console.log('bookingDate', bookingDate)
          console.log('bookingTime', bookingTime)
          console.log('name', name)
          console.log('phoneNumber', phoneNumber)
          console.log('email', email)
  
          await sendBookingConfirmation({
            clientFirstName: name,
            phone: phoneNumber,
            bookingDate,
            bookingTime,
          })
        }
      } catch (error) {
        console.error('WhatsApp send failed:', error)
      }
  
      setCurrentStep(prev => prev + 1)
    } catch (error) {
      console.error('handleSubmit failed:', error)
      handleIsErrorSubmit(true)
      setCurrentStep(prev => prev + 2)
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
          sitekey={`${RECAPTCHA_PROD}`}
          // sitekey={`${RECAPTCHA_LOCAL}`}
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