---
title: Groq Social Draft 400 Fix
type: delivery
status: implemented
date: 2026-10-08
---

# Groq Social Draft 400 Fix

## What changed

Updated the social-promotion caption generator to use Groq JSON mode safely with the default `openai/gpt-oss-20b` model. The request now sets `reasoning_effort` to `low`, hides reasoning output with `reasoning_format: "hidden"`, and allows up to 1,024 completion tokens. Provider error logging now records the response status and a truncated response body without logging credentials.

## Why

The caption-generation request returned HTTP 400 before a social campaign draft could be created. Groq's reasoning documentation requires parsed or hidden reasoning when JSON mode is used with reasoning models. The previous request enabled `response_format: { type: "json_object" }` without setting `reasoning_format`, and it logged only the status, which hid the provider's diagnostic response.

## Affected paths

- `backend/src/utils/social-promotion-content/index.ts`

## Verification

- `cd backend && bunx tsc --noEmit` passed.
- `cd backend && bun build src/index.ts --outdir dist-verify-social-fix --target bun` passed.
- Temporary build output was removed after verification.
- No live Groq request was sent during verification; manual draft creation remains an owner acceptance check.

## References

- [Groq reasoning documentation](https://console.groq.com/docs/reasoning)
- [Groq GPT-OSS 20B model documentation](https://console.groq.com/docs/model/openai/gpt-oss-20b)

## Commit

Not created yet.
