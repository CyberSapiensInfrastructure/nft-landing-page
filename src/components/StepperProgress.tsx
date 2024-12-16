import React, { useState } from "react";

interface Step {
  title: string;
  xp: number;
  isCompleted: boolean;
  description: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentXP: number;
  maxXP: number;
}

const StepperProgress: React.FC<StepperProgressProps> = ({
  steps,
  currentXP,
  maxXP,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed right-6 top-6 z-50 bg-[#0c0c0c] border border-[#d8624b]/20 rounded-full p-2
          hover:bg-[#d8624b]/10 hover:border-[#d8624b]/40 group transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#d8624b] group-hover:text-[#d8624b]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-[#0c0c0c]/95 backdrop-blur-md border border-[#d8624b]/20 rounded-lg p-4 transition-all duration-300 hover:border-[#d8624b]/40">
      {/* XP Progress */}
      <div className="flex items-center justify-between text-xs mb-4">
        <span className="text-white/60">Quest Progress</span>
        <div className="flex items-center gap-2">
          <span className="text-[#d8624b] font-medium">
            {currentXP}/{maxXP} XP
          </span>
          <div className="w-1 h-1 rounded-full bg-[#d8624b] animate-pulse" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[#d8624b]/10 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#d8624b] transition-all duration-1000 ease-out"
          style={{ width: `${(currentXP / maxXP) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#d8624b]/5" />

        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  relative z-10 bg-[#0c0c0c] group hover:scale-110
                  ${
                    step.isCompleted
                      ? "border-[#d8624b] bg-[#d8624b]"
                      : "border-[#d8624b]/20"
                  }`}
              >
                {step.isCompleted ? (
                  <svg
                    className="w-4 h-4 text-[#000] animate-checkmark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-xs text-white/40">{index + 1}</span>
                )}

                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2  
                  opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                >
                  <div className="bg-black/90 rounded-lg px-3 py-2 text-center w-32">
                    <div className="text-xs font-medium text-white">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-[#d8624b]">
                      +{step.xp} XP
                    </div>
                    <div className="text-[10px] text-white/60 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[calc(100%+0.5rem)] h-[2px] w-[calc(100%-2rem)] 
                    transition-all duration-1000
                    ${step.isCompleted ? "bg-[#d8624b]" : "bg-transparent"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepperProgress;
