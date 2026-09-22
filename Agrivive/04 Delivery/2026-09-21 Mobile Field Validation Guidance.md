---
title: Mobile Field Validation Guidance
type: delivery
date: 2026-09-21
status: skill updated; screen changes proposed
---

# Mobile Field Validation Guidance

The owner requested that each form field display its own validation errors below the input, instead of collecting field errors at the top of the form.

## Changes

Updated `.agents/skills/mobile/SKILL.md` with project-specific guidance for field-keyed validation, mapping API errors to fields, preserving unrelated errors, dependent confirmation validation, accessible inline messages, and separate feedback for map and upload controls. General connection or service failures belong near the submit action.

## Current app findings and proposed changes

- `mobile/src/components/InputComponent.tsx` already accepts an error prop and renders it below the input. Its error text is currently 12 px; propose increasing it to 14 px and adding accessible announcements and input/error associations.
- Authentication and profile screens have separate general-error blocks above their forms. Propose keeping known field failures with their inputs and moving genuine form-wide failures near the submit button.
- Centralize structured API field-path and known error-code mapping. Preserve neutral invalid-credentials wording, instead of assuming which credential is incorrect.
- Clear or revalidate only the edited field and dependent fields, retain entered values, and focus the first invalid control after submission.

## Verification

Read the shared input and current registration/login/verification/profile form handlers. Confirmed the new guidance is present in the skill. This change only updates instructions and this delivery note; it does not claim that screen behavior has been fixed or device-tested.

The skill creator's Python validator could not run because PyYAML is not installed. Parsed and checked the YAML frontmatter with Bun instead; the skill name, description, and project guidance passed that check.
