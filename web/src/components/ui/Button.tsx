import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-200 select-none active:scale-95 disabled:pointer-events-none disabled:opacity-50";

  const sizeStyles = {
    sm: "min-h-[40px] px-4 py-2 text-xs rounded-xl gap-1.5",
    md: "min-h-[48px] px-6 py-2.5 text-sm rounded-2xl gap-2",
    lg: "min-h-[52px] px-8 py-3.5 text-base rounded-full gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#457D00] text-white hover:bg-[#457D00]/90 shadow-md hover:shadow-lg active:bg-[#2e5200]",
    accent:
      "bg-[#E2FD56] text-[#14231A] hover:bg-[#E2FD56]/90 shadow-md hover:shadow-lg font-black",
    outline:
      "border border-neutral-300 bg-white/90 text-neutral-800 hover:bg-neutral-50 hover:border-[#457D00] backdrop-blur-sm",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
