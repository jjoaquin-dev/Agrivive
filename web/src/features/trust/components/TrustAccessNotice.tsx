import Link from "next/link";
import { AlertTriangle, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TrustAccessNotice({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-3 gap-2 border-destructive/30 bg-destructive/5 text-destructive">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 shrink-0 text-destructive" />
        <AlertTitle className="font-semibold text-destructive">Reservations temporarily paused</AlertTitle>
      </div>

      <AlertDescription className="text-xs leading-relaxed text-destructive/90">
        {message}
      </AlertDescription>

      <div className="pt-1">
        <Link
          href="/account-recovery"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-10 w-full gap-2 border-destructive/30 bg-white font-medium text-xs shadow-xs hover:bg-destructive/5 hover:text-destructive sm:w-auto",
          )}
        >
          <KeyRound className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Restore access earlier with email code</span>
        </Link>
      </div>
    </Alert>
  );
}
