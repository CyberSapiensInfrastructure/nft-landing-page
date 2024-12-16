import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "error";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "relative overflow-hidden transition-all duration-300";
  const variantStyles = {
    primary: "bg-[#d8624b]/10 border-[#d8624b]/20 hover:border-[#d8624b]/40",
    error: "bg-red-500/10 border-red-500/20 hover:border-red-500/40",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm tracking-[0.2em]",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        glitch-container backdrop-blur-sm border rounded-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isLoading ? "animate-pulse" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      <span
        className={`glitch-text relative z-10 flex items-center justify-center gap-2`}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-[#d8624b] border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};

export default Button;
