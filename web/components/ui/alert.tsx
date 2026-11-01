import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("flex w-full flex-col gap-1 rounded-2xl border px-4 py-3.5 text-sm shadow-[0_8px_24px_rgba(31,77,58,0.06)]", {
  variants: {
    variant: {
      default: "border-neutral-200/80 bg-white text-neutral-900",
      destructive: "border-rose-200/80 bg-rose-50/70 text-rose-900",
      success: "border-emerald-200/80 bg-emerald-50/70 text-emerald-900",
      warning: "border-amber-200/80 bg-amber-50/70 text-amber-900",
    },
  },
  defaultVariants: { variant: "default" },
});

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="alert-title" className={cn("font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("leading-6 opacity-90", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
