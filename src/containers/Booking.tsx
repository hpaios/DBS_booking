import { useState } from 'react'
import ProgressBar from '../components/ProgressBar/ProgressBar'
import { steps } from '../config'
import SelectServices from '../components/SelectServices'
import SelectCategories from '../components/SelectCategories/SelectCategories'
import SelectSlots from '../components/SelectSlots'
import BookingConfirmation from '../components/BookingConfirmation'
import type { StepKey } from '../interfaces'
import { toggleId } from '../utils'


const Booking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([]);

  const handleSelectCategory = (id: number) => {
    setSelectedCategoriesIds((prev) => toggleId(prev, id));
  }

  const stepComponentMap: Record<StepKey, React.ReactNode> = {
    select_categories: <SelectCategories selectCategory={handleSelectCategory} selectedCategoriesIds={selectedCategoriesIds}/>,
    select_services: <SelectServices />,
    select_slots: <SelectSlots />,
    booking_confirmation: <BookingConfirmation />,
  };

  const setNextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const setPrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const getComponentByStep = () => {
    return stepComponentMap[steps[currentStep].key] ?? null;
  };

  return (<div>
    <h2 className="text-xs sm:text-sm mt-2 text-center text-[var(--color-text)]">{steps[currentStep].label}</h2>
    <ProgressBar
      currentStep={currentStep}
      handleNextStep={setNextStep}
      handlePrevStep={setPrevStep}
    />
    {getComponentByStep()}
  </div>)
}

export default Booking