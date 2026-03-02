import React, { useState } from "react";
import ArrowLeft from '../../icons/ArrowLeft'
import ArrowRight from '../../icons/ArrowRight'
import { navButtonClass } from './ProgressBar.style'

interface Step {
  key: string;
  label: string;
}

const steps: Step[] = [
  { key: "select_categories", label: "Vyberte specialistu" },
  { key: "select_services", label: "Vyberte služby" },
  { key: "select_slots", label: "Vyberte datum a čas" },
  { key: "booking_confirmation", label: "Podrobnosti schůzky" },
];

const ProgressBar: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Steps container */}
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300 z-0 rounded">
        <span className="text-xs sm:text-sm mt-2 text-center text-[var(--color-text)]">{steps[currentStep].label}</span>
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
              onClick={() => setCurrentStep(index)}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-300
                  ${
                    isCompletedOrActive
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className={navButtonClass}
        >
          <ArrowLeft width={16} height={30} color={currentStep === 0 ? "var(--color-border)" : "var(--color-icon)"} />
        </button>
        <button
          onClick={goNext}
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