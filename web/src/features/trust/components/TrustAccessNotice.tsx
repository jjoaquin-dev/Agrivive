import Link from "next/link";
import { AlertTriangle, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TrustAccessNotice({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>Account access is limited</AlertTitle>
      <AlertDescription>
        <span>{message}</span>
        <Link href="/account-recovery" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3 min-h-11 gap-2 border-destructive/30 bg-white") }>
          <KeyRound className="size-4" aria-hidden="true" />Restore access with email code
        </Link>
      </AlertDescription>
    </Alert>
  );
}
