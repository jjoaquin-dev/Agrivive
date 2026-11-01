# The 6-hour rule stops when the listing starts over (2026-11-01)

**What:** n8n's `follow_up` call reached the context route and got `409 Listing cycle is no longer current`. The listing had started a new cycle after the boost (sold out and restocked from 0, archived and listed again, or an old listing set up on its first edit). Its price also resets in that case, so the old boost's 6-hour rule no longer applies. Before, the worker kept asking every 15 minutes (5 times) and n8n showed an error each time. Now the context route clears the boost's 6-hour timer before answering 409, so it stops.

**Files:** backend integrations.visibility-boost.context.ts (dist rebuilt). No mobile change.

**Checked:** backend `bunx tsc --noEmit` clean. Not run against n8n. The earlier fix works: `follow_up` now reaches n8n.
