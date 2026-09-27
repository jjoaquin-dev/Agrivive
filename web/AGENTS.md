# Buyer Web Guidelines

## Design source

Use:

- `.agents/design/web-design/DESIGN.md`
- `.agents/design/web-design/DESIGN-LAYOUT.md`

These adapt the seller mobile brand system for the buyer website. Keep the mobile design files unchanged.

## Frontend skills

Use the installed `front-end-developer` skill for:

- Next.js and React structure.
- TypeScript.
- CSS and responsive layout.
- Accessibility.
- Form and data-flow implementation.

Use the installed `frontend-design` skill for:

- Visual direction.
- Typography.
- Layout polish.
- Component composition.
- Responsive interface quality.

## Product scope

The buyer website supports public marketplace browsing and requires buyer authentication before reservation.

The first release uses:

- Product browsing and filters.
- Product details.
- One-item Buy Now orders.
- Buyer order history and order details.
- QR reservation display.
- Pending-order cancellation.

Do not add cart, batch ordering, buyer messaging, reviews, or recommendations unless separately approved.

## Implementation rules

- Use Next.js App Router.
- Keep API keys and secrets out of browser code.
- Use the existing backend authentication and buyer order endpoints.
- Preserve loading, empty, offline, retry, unauthorized, sold-out, and validation states.
- Use semantic HTML and visible keyboard focus.
- Keep interactive controls at least 44px and primary controls at least 48px high.
- Follow the repository root `AGENTS.md`, including approval before edits and Obsidian vault updates.
