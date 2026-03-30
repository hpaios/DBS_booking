import { useState } from 'react'
import ProgressBar from '../components/ProgressBar/ProgressBar'
import SelectServices from '../components/SelectServices/SelectServices'
import SelectCategories from '../components/SelectCategories/SelectCategories'
import BookingConfirmation from '../components/BookingConfirmation/BookingConfirmation'
import type { SelectedSlot, Service, StepKey } from '../interfaces'
import { useGroupedServices } from '../hooks/useGroupedServices'
import { isObjectEmpty, toggleId, toggleObjectById } from '../utils'
import { useLocation } from '../api/hooks/useLocations'
import SelectSlots from '../components/SelectSlots/SelectSlots'
import { steps } from '../config'
import SuccessPage from '../components/SuccessPage/SuccessPage'
import LocationIcon from '../icons/LocationIcon'
import ErrorPage from '../components/ErrorPage/ErrorPage'

const Booking = ({handleIsErrorSubmit}: {
  handleIsErrorSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([])
  const { groupedServices, isLoading, error } = useGroupedServices(selectedCategoriesIds)
  const { data: location } = useLocation()
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Record<number, SelectedSlot | null>>({})
  const [selectedDates, setSelectedDates] = useState<Record<number, string>>({})

  const handleSelectCategory = (id: number) => {
    setSelectedCategoriesIds(prev => {
      const newCategories = toggleId(prev, id)
      setSelectedServices(services =>
        services.filter(service => newCategories.includes(service.parentCategoryId))
      )
      return newCategories
    })
  }

  const handleSelectServices = (service: Service) => {
    if (!isObjectEmpty(selectedSlots)) {
      setSelectedSlots({})
    }

    if (!isObjectEmpty(selectedDates)) {
      setSelectedDates({})
    }

    setSelectedServices(prev => toggleObjectById(prev, service))
  }

  const stepComponentMap: Record<StepKey, React.ReactNode> = {
    select_categories: <SelectCategories
      selectCategory={handleSelectCategory}
      selectedCategoriesIds={selectedCategoriesIds}
    />,
    select_services: <SelectServices
      servicesList={groupedServices}
      handleSelectedService={handleSelectServices}
      selectedServices={selectedServices}
      isLoading={isLoading}
      error={error}

    />,
    select_slots: <SelectSlots
      selectedServices={selectedServices}
      weekSchedule={location?.[0].weekSchedule ?? []}
      selectedSlots={selectedSlots}
      onSelectSlot={(employeeId, slot) =>
        setSelectedSlots(prev => ({ ...prev, [employeeId]: slot }))
      }
      selectedDates={selectedDates}
      onSelectedDate={setSelectedDates}
    />,
    booking_confirmation: <BookingConfirmation 
      selectedServices={selectedServices}
      selectedSlots={selectedSlots}
      selectedDates={selectedDates}
      setCurrentStep={setCurrentStep}
      handleIsErrorSubmit={handleIsErrorSubmit}
      
    />,
    success_page: <SuccessPage selectedServices={selectedServices}  selectedSlots={selectedSlots}/>,
    error_page: <ErrorPage />
  }

  const setNextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const setPrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const isNextButtonDisabled = (currentStep === 0 && !selectedCategoriesIds.length)
  || (currentStep === 1 && !selectedServices.length)
  || (currentStep === 2 && isObjectEmpty(selectedSlots))
  || (currentStep === 3)

  return (
    <div className="bg-[var(--color-bg-secondary)] font-sans p-[1.5rem] rounded-[var(--radius-lg)] mt-[-10px] relative min-h-[480px]">
      <h1 className='text-[var(--color-icon)] text-center font-sans'>DBS | Technické centrum & Detailing</h1>
      <h3 className='text-[var(--color-icon)] flex items-center gap-[0.5rem] justify-center font-sans'>
        <LocationIcon width={"16"} height={"16"}/>
        <div>Františka Kadlece 2441, 180 00 Praha 8-Libeň</div>
      </h3>
        {
          steps[currentStep]?.key !==  'success_page' &&
          steps[currentStep]?.key !==  'error_page' &&
          <ProgressBar
            label={steps[currentStep]?.label}
            currentStep={currentStep}
            handleNextStep={setNextStep}
            handlePrevStep={setPrevStep}
            isNextButtonDisabled={isNextButtonDisabled}
          />
        }

      {stepComponentMap[steps[currentStep].key]}
      {!isNextButtonDisabled && steps[currentStep]?.key !==  'success_page'
      && steps[currentStep]?.key !== 'booking_confirmation' && steps[currentStep]?.key !== 'error_page' &&
        <div className="fixed bottom-[2rem] left-1/2 -translate-x-1/2 w-full max-w-[660px] px-4 z-50">
          <div className='p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]'>
            <button onClick={setNextStep}
              className='bg-[var(--color-icon)] block text-center text-[var(--color-bg-secondary)] w-full cursor-pointer text-[18px] font-semibold p-2 rounded-[var(--radius-lg)] font-sans'>
                Další
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default Booking
