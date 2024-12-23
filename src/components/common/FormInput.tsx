import React from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  helperText?: string;
  showValidation?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  helperText,
  showValidation = true
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-sm text-gray-400 block">{label}</label>
      {showValidation && (
        <div className="flex items-center gap-2">
          {value && !error && (
            <span className="text-green-500 text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Valid
            </span>
          )}
          {value && error && (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Invalid
            </span>
          )}
        </div>
      )}
    </div>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-2 pl-3 pr-10 rounded-lg bg-slate-700 text-white border transition-colors
          ${error ? 'border-red-500 focus:border-red-600' : value && !error ? 'border-green-500 focus:border-green-600' : 'border-slate-600 focus:border-purple-500'}
          focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {!error ? (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
    </div>
    <div className="min-h-[1.5rem]">
      {error ? (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-gray-400 text-sm mt-1">{helperText}</p>
      ) : null}
    </div>
  </div>
); 