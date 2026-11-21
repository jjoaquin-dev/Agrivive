---
title: Overview Eight Charts and Chart Guides
type: delivery
date: 2026-11-15
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Builds on: [[2026-11-15 Overview Chart.js Calendar and Groq Explanations]]

## Why
The owner saw the first Chart.js version (and the older live page) and asked for: more Chart.js chart types, no advice or prediction anywhere, every x and y label explained, and the header not covering the logo.

## Done
- Eight Chart.js charts, all types registered with `registerables`: mixed bar and line (pickups per period with a running total on a right axis), radar (weekday), horizontal bar (most bought, average price), scatter (orders against price), doughnut (share of pickups by kind), pie (share of open listings by kind), grouped horizontal bar (bought vs listed). Grouped under three headings.
- Each chart now has a "How to read this chart" box that says what the x axis, y axis (and right axis, slices, dots or colours) mean in plain words, then the Groq explanation, then the breakdown table. Axis titles are written out in words.
- Groq now writes eight lines (one per chart) and is told to name at most the three biggest items. The same number and forward-looking-word checks apply. Timeout for this call is 15 seconds (`askGroq` takes an optional `timeoutMs`).
- No advice or prediction text exists in the new page. The "Market Planning Advice" box the owner saw is the older deployed page; it was removed from the code earlier and goes away when the web is redeployed.
- Header: the nav link was renamed "Public Overview" and the large-screen extra padding removed so the links fit beside the logo instead of spilling over it.
- PDF now holds all eight charts with their explanations and tables.

## Checks
Backend and web typecheck and `next build` pass; Groq returned all eight lines locally (one earlier run listed Tuesday as having no pickups although it had one: the number check cannot catch a right number on the wrong item, so the prompt was tightened to name only the top three items). Not opened in a browser. Deploy API then web.
