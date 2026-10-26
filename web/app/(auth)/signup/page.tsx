"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { SignUpForm } from "@/src/features/auth/components/SignUpForm";
import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation, withNextPath } from "@/src/lib/navigation";

export default function SignUpPage() {
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);

  useEffect(() => {
    setNextPath(getNextPathFromLocation());
  }, []);

  return (
    <AuthShell
      title="Create your buyer account"
      description="Reserve fresh vegetables from local markets and track your pickups."
      formMaxWidth="max-w-[560px]"
      footer={
        <p className="text-sm text-[#5F7367]">
          Already have an account?{" "}
          <Link
            href={withNextPath("/login", nextPath)}
            className="inline-flex items-center gap-1 font-semibold text-[#457D00] hover:text-[#FEA938] hover:underline transition-colors"
          >
            <span>Sign in</span>
            <LogIn aria-hidden="true" className="size-3.5" />
          </Link>
        </p>
      }
    >
      <SignUpForm nextPath={nextPath} />
    </AuthShell>
  );
}
