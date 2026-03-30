import ArrowLeft from '../../icons/ArrowLeft'
import ArrowRight from '../../icons/ArrowRight'
import { steps } from '../../config'
import { navButtonClass, stepClass, stepContainer } from './ProgressBar.style'

const ProgressBar = ({
  label,
  currentStep,
  handleNextStep,
  handlePrevStep,
  isNextButtonDisabled
}: {
  label: string
  currentStep: number
  isNextButtonDisabled: boolean
  handleNextStep: () => void
  handlePrevStep: () => void
}) => {

  const isDisabled = currentStep === steps.length - 1 || isNextButtonDisabled
  
  return (
    <div className="max-w-xl mx-auto mb-[2rem]">
      <div className="flex justify-between mt-[var(--space-lg)] mb-[var(--space-sm)]">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={navButtonClass}
        >
          <ArrowLeft width={16} height={30} color={currentStep === 0 ? "var(--color-border)" : "var(--color-icon)"} />
        </button>
        <h2 className="text-center text-[var(--color-icon)] font-sans">
          {label}
        </h2>
        <button
          onClick={handleNextStep}
          disabled={isDisabled}
          className={navButtonClass}
        >
          <ArrowRight
            width={16}
            height={30}
            color={isDisabled ? "var(--color-border)" : "var(--color-icon)"}
          />
        </button>
      </div>

      <div className={stepContainer}>
        {steps
        .filter(step => step.key !== "success_page" && step.key !== "error_page")
        .map((step, index) => {
          const isCompletedOrActive = index <= currentStep;
          const isFirst = index === 0;
          const isLast = index === steps.length - 3;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center z-10 cursor-pointer w-full"
              onClick={() => handleNextStep()}
              >
              <div
                className={`${stepClass}
                  ${isCompletedOrActive ? "bg-[var(--color-icon)]" : "bg-[var(--color-gray)]"}
                  ${isFirst ? "rounded-l-full" : ""}
                  ${isLast ? "rounded-r-full" : ""}
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;