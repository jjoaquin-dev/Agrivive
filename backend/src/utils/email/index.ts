import { createHash } from "node:crypto";
import dotenv from "dotenv";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  key: string,
) {
  // Dynamically reload .env so changes take effect without server restart
  dotenv.config({ override: true });

  const mailtrapToken = process.env.MAILTRAP_API_TOKEN;
  let mailtrapInboxId = process.env.MAILTRAP_INBOX_ID;

  // Fallback placeholder to verified inbox ID
  if (!mailtrapInboxId || mailtrapInboxId === "your_mailtrap_inbox_id") {
    mailtrapInboxId = "4920653";
  }

  // 1. If Mailtrap sandbox credentials exist, deliver to Mailtrap web inbox
  if (mailtrapToken && mailtrapInboxId) {
    const response = await fetch(
      `https://sandbox.api.mailtrap.io/api/send/${mailtrapInboxId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailtrapToken}`,
          "Api-Token": mailtrapToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [{ email: to }],
          from: { email: "noreply@agrivive.com", name: "Agrivive" },
          subject,
          text,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Mailtrap Error] Delivery to ${to} failed (${response.status}):`,
        errorText,
      );
      throw new Error(`Mailtrap delivery failed (${response.status}): ${errorText}`);
    }

    console.log(`[Mailtrap Success] Email captured in Mailtrap inbox for ${to}`);
    return;
  }

  // 2. Fallback to Resend if configured
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (apiKey && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": createHash("sha256").update(key).digest("hex"),
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[Resend Error] Delivery to ${to} failed (${response.status}):`,
        errorBody,
      );
      throw new Error(`Resend delivery failed (${response.status}): ${errorBody}`);
    }

    console.log(`[Resend Success] Verification email sent to ${to}`);
    return;
  }

  // 3. Fallback development log
  console.log(`[Dev Sandbox] Simulated email delivery to ${to}`);
}

export function sendAuthCode(email: string, otp: string, type: string) {
  if (type === "sign-in") throw new Error("Email OTP sign-in is disabled");
  console.log(`\n==================================================`);
  console.log(`[AUTH OTP] ${type.toUpperCase()} CODE FOR ${email}: ${otp}`);
  console.log(`==================================================\n`);
  const id = createHash("sha256").update(`${email}:${type}:${otp}`).digest("hex");
  return sendEmail(
    email,
    "Agrivive verification code",
    `Your ${type} code is ${otp}.`,
    `otp:${id}`,
  );
}
