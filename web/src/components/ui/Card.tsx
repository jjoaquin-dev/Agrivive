import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "cream" | "elevated" | "accent";
  children: React.ReactNode;
}

export function Card({
  variant = "white",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles =
    "relative overflow-hidden rounded-[24px] transition-all duration-300";

  const variantStyles = {
    white:
      "bg-white border border-neutral-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-lg",
    cream:
      "bg-[#FAF9F5] border border-neutral-200/80 shadow-xs hover:border-[#457D00]/30",
    elevated:
      "bg-white border border-neutral-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-xl",
    accent:
      "bg-[#457D00] text-white border border-[#386600] shadow-xl",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
