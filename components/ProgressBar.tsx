interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Ensure currentStep does not exceed totalSteps for display purposes
  // and doesn't go below 0.
  const displayStep = Math.max(0, Math.min(currentStep, totalSteps));

  // Calculate the percentage for the filled part of the bar
  const progressPercentage = totalSteps > 0 ? (displayStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
      <div className="max-w-2xl mx-auto"> {/* Centered and with a max-width */}
        <div className="flex items-center justify-between mb-1.5">
        </div>
        <div className="flex items-center">
          <div className="flex-1 relative">
            {/* The main track of the progress bar */}
            <div className="h-2.5 bg-gray-200 rounded-full"></div>
            {/* The filled part of the progress bar */}
            <div
              className="absolute top-0 left-0 h-2.5 bg-[#F5B614] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            {/* Circles for each step, overlaid on the bar */}
            <div className="absolute top-1/2 left-0 w-full h-0 flex items-center justify-between transform -translate-y-1/2">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1; // Steps are 1-indexed
                const isCompleted = stepNumber <= displayStep;

                return (
                  <div
                    key={stepNumber}
                    className={`w-3 h-3 rounded-full border-1 flex items-center justify-center
                                transition-all duration-500 ease-out
                                ${isCompleted ? 'bg-[#F5B614] border-[#DAA520]' : 'bg-white border-gray-300'}
                                `}
                    title={`Paso ${stepNumber}`}
                  >
                  </div>
                );
              })}
            </div>
          </div>
          {/* Flag at the end */}
          <div className="ml-3 text-3l">🚩</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 