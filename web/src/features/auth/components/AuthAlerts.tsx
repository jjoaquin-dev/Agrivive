import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info } from "lucide-react";

type AuthAlertsProps = {
  verifiedNotice?: boolean;
  checkoutNotice?: boolean;
  formError?: string;
};

export function AuthAlerts({
  verifiedNotice,
  checkoutNotice,
  formError,
}: AuthAlertsProps) {
  return (
    <>
      {verifiedNotice ? (
        <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle className="size-4 text-emerald-600" />
          <AlertDescription>
            Your email was verified successfully! Please sign in.
          </AlertDescription>
        </Alert>
      ) : null}

      {checkoutNotice && !verifiedNotice ? (
        <Alert className="mb-5 border-amber-200 bg-amber-50 text-amber-900">
          <Info className="size-4 text-amber-600" />
          <AlertDescription>
            Sign in to complete your produce reservation.
          </AlertDescription>
        </Alert>
      ) : null}

      {formError ? (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
