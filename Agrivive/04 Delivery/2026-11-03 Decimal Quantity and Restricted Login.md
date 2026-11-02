# Decimal quantity, recovery notice, restricted login (2026-11-03)

## What changed
- **Decimal amounts.** New `web/src/lib/quantity.ts` and `web/src/components/QuantityStepper.tsx`: plus and minus move by 0.5, and the middle box takes any amount from 0.01 up to the stock (for example 0.25 or 2.75). Used on the marketplace and seller storefront cards (`ProductCardAction.tsx`), the home featured card, and the cart (`CartQuantitySelectorComponent.tsx`). The product page box already took decimals; it now opens the decimal keypad. Orders already showed decimals. The backend already accepted 0.01 and up.
- **Recovery notice.** `TrustAccessNotice.tsx` redesigned as a stacked card with a full-width 48px button. It closes the cart drawer first (the drawer sat on top of the recovery page, which is why the link seemed dead), and fills in the email and return page.
- **Recovery for paused buyers.** `trust.recovery.ts` required `isActive = false`, but a reservation pause leaves the buyer active, so the code was never sent. It now needs only an open pause or block.
- **Restricted login.** A Better Auth `session.create.before` hook (`modules/auth/index.ts`, `utils/trust/read-login-block.ts`) refuses a session for a blocked account or a running pause (403, `ACCOUNT_RESTRICTED`). The web login page sends that person to the recovery page.

## Verification
`tsc --noEmit` in `backend/` and `web/`, `bun run build` in `web/`, `backend/dist` rebuilt. Not tried by hand: sign in as a paused buyer, restore with the email code, order 0.5 kilo.
