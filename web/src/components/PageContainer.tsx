import type { ComponentPropsWithoutRef } from "react";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

export function PageContainer({ className = "", ...props }: PageContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props} />;
}
