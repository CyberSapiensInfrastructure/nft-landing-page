import React from "react";

interface ModalProps {
  type: "success" | "error";
  isOpen: boolean;
  onReset: () => void;
  canClose: boolean;
  data?: {
    animation?: "like";
  };
}

const Modal: React.FC<ModalProps> = ({
  type,
  isOpen,
  onReset,
  canClose,
  data,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-[#0c0c0c] border border-[#7042f88b]/20 rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          {/* Like Animation Icon */}
          <div className="animate-[likeAnimation_0.5s_ease-in-out]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-[#7042f88b]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Title & Message */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-medium text-[#7042f88b]">
              Quest Completed!
            </h3>
            <p className="text-white/60">Thank you for supporting Providence</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Like Task</span>
              <span className="text-[#7042f88b]">Completed</span>
            </div>
            <div className="h-1 bg-[#7042f88b]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7042f88b] transition-all duration-1000 ease-out w-0"
                style={{
                  animation: "progress 1.5s ease-out forwards",
                }}
              />
            </div>
          </div>

          {/* Action Button */}
          {canClose && (
            <button
              onClick={onReset}
              className="w-full px-8 py-3 bg-[#7042f88b]/10 hover:bg-[#7042f88b]/20 border border-[#7042f88b]/20 rounded-lg transition-all duration-300 text-sm"
            >
              Start New Quest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Animasyonlar için keyframes ekle
const style = document.createElement("style");
style.textContent = `
  @keyframes likeAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes progress {
    0% { width: 0; }
    100% { width: 100%; }
  }
`;
document.head.appendChild(style);

export default Modal;
