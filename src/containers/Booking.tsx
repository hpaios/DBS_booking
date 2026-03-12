import { useState } from 'react'
import ProgressBar from '../components/ProgressBar/ProgressBar'
import SelectServices from '../components/SelectServices/SelectServices'
import SelectCategories from '../components/SelectCategories/SelectCategories'
import BookingConfirmation from '../components/BookingConfirmation'
import type { SelectedSlot, Service, StepKey } from '../interfaces'
import { useGroupedServices } from '../hooks/useGroupedServices'
import { isObjectEmpty, toggleId, toggleObjectById } from '../utils'
import { useLocation } from '../api/hooks/useLocations'
import SelectSlots from '../components/SelectSlots/SelectSlots'
import { steps } from '../config'

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([])
  const { groupedServices } = useGroupedServices(selectedCategoriesIds)
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
    />
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

  return (
    <div>
      <h2 className="text-xs sm:text-sm mt-2 text-center text-[var(--color-text)]">
        {steps[currentStep].label}
      </h2>

      <ProgressBar
        currentStep={currentStep}
        handleNextStep={setNextStep}
        handlePrevStep={setPrevStep}
        isNextButtonDisabled={isNextButtonDisabled}
      />

      {stepComponentMap[steps[currentStep].key]}
    </div>
  )
}

export default Booking