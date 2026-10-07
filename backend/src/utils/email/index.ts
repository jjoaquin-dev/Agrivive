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

  const provider = resolveEmailProvider();
  const idempotencyKey = createHash("sha256").update(key).digest("hex");
  const allowDevEmailLog = process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_EMAIL_LOG === "true";

  if (provider === "mailtrap") {
    const mailtrapToken = process.env.MAILTRAP_API_TOKEN?.trim();
    const mailtrapInboxId = process.env.MAILTRAP_INBOX_ID?.trim();
    if (!mailtrapToken || !mailtrapInboxId) {
      if (allowDevEmailLog) {
        console.log(`[Dev Sandbox] Simulated Mailtrap delivery to ${to}`);
        return;
      }
      throw new Error("Mailtrap email provider requires MAILTRAP_API_TOKEN and MAILTRAP_INBOX_ID");
    }

    const response = await fetch(
      `https://sandbox.api.mailtrap.io/api/send/${mailtrapInboxId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailtrapToken}`,
          "Api-Token": mailtrapToken,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
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

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      if (allowDevEmailLog) {
        console.log(`[Dev Sandbox] Simulated Resend delivery to ${to}`);
        return;
      }
      throw new Error("Resend email provider requires RESEND_API_KEY and RESEND_FROM_EMAIL");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
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

  if (allowDevEmailLog) {
    console.log(`[Dev Sandbox] Simulated email delivery to ${to}`);
    return;
  }

  throw new Error("Email provider is not configured");
}

export function sendAuthCode(email: string, otp: string, type: string) {
  if (type === "sign-in") throw new Error("Email OTP sign-in is disabled");
  if (process.env.ALLOW_DEV_EMAIL_LOG === "true") {
    console.log(`[Dev OTP] ${type.toUpperCase()} code generated for ${email}`);
  }
  const id = createHash("sha256").update(`${email}:${type}:${otp}`).digest("hex");
  return sendEmail(
    email,
    "Agrivive verification code",
    `Your ${type} code is ${otp}.`,
    `otp:${id}`,
  );
}

function resolveEmailProvider(): "mailtrap" | "resend" {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configured && configured !== "mailtrap" && configured !== "resend") {
    throw new Error("EMAIL_PROVIDER must be resend or mailtrap");
  }
  if (configured === "mailtrap" || configured === "resend") return configured;
  return process.env.NODE_ENV === "production" ? "resend" : "mailtrap";
}
