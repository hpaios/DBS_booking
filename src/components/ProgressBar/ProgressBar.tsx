import ArrowLeft from '../../icons/ArrowLeft'
import ArrowRight from '../../icons/ArrowRight'
import { navButtonClass } from './ProgressBar.style'
import { steps } from '../../config'


const ProgressBar = ({
  currentStep,
  handleNextStep,
  handlePrevStep
}: {
  currentStep: number,
  handleNextStep: () => void
  handlePrevStep: () => void
}) => {
  
  
  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Steps container */}
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300 z-0 rounded">
          <div
            className="h-1 bg-[var(--color-primary)] rounded transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step circles */}
        {steps.map((step, index) => {
          const isCompletedOrActive = index <= currentStep;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center z-10 cursor-pointer"
              onClick={() => handleNextStep()}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300
                  ${
                    isCompletedOrActive
                      ? "text-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-white"
                  }`}
              >
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between my-[var(--space-lg)] ">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={navButtonClass}
        >
          <ArrowLeft width={16} height={30} color={currentStep === 0 ? "var(--color-border)" : "var(--color-icon)"} />
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
          className={navButtonClass}
        >
          <ArrowRight width={16} height={30} color={currentStep === steps.length - 1 ? "var(--color-border)" : "var(--color-icon)"} />
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;