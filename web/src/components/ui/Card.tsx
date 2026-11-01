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
    "relative overflow-hidden rounded-2xl transition-all duration-300";

  const variantStyles = {
    white:
      "bg-white border border-neutral-200/70 shadow-md hover:-translate-y-1 hover:shadow-lg",
    cream:
      "bg-[#FAF9F5] border border-neutral-200/80 shadow-sm hover:border-[#457D00]/30",
    elevated:
      "bg-white border border-neutral-200/80 shadow-md hover:-translate-y-1 hover:shadow-lg",
    accent:
      "bg-[#457D00] text-white border border-[#457D00] shadow-lg",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
