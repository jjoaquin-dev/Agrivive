---
title: Contextual Advisories
type: mechanism
status: proposed
source_pages: [4, 7, 8, 20, 21, 22]
---

# Contextual Advisories

## Weather and calendar context

Open-Meteo supplies outdoor weather; Nager.Date supplies Philippine public-holiday information. These can prompt inspection, handling, and selling-plan reminders. A failed nonessential API should not prevent stored listings and transaction records from displaying. [[Architecture and Integrations]]

## Q10 temperature-adjusted inspection model

For a supported vegetable with **validated, product-specific** reference shelf life `SLref`, reference temperature `Tref`, and Q10 coefficient, and a seller-recorded or measured storage temperature `Ts`:

`estimated total duration = SLref / Q10^((Ts - Tref) / 10)`

`estimated remaining duration = max(0, estimated total duration - elapsed storage time)`

The PDF's illustrative cabbage values (`SLref=21 days`, `Tref=5°C`, `Q10=2.5`) are **not yet validated implementation parameters**. Do not use one generic Q10 value for every vegetable.

## Prototype reminder levels

| Estimated remaining duration | Reminder |
|---|---|
| More than 3 days | Continue routine physical inspection |
| More than 1 through 3 days | Priority inspection |
| More than 0 through 1 day | Immediate inspection and listing update |
| 0 days | Inspect; deactivate if no longer marketable |

If actual storage temperature is unavailable, **do not calculate a numerical estimate from outdoor weather**. Show a general weather-related inspection reminder instead. Rainfall and humidity may inform separate rules but are not Q10 inputs here.

## Language rule

Tell the seller to physically inspect and update photos and declared condition. Never say the model has established that produce is fresh, spoiled, safe, unsafe, or will spoil at a specific hour. [[Goals and Boundaries]]

**Source:** PDF pp. 4, 7–8, 20–22.
