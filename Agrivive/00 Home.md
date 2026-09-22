---
title: Agrivive Second Brain
type: map
status: active
---

# Agrivive Second Brain

**Agrivive** is a proposed Davao City marketplace for seller-declared, marketable surplus vegetables. Sellers use a mobile app to list produce; buyers use a web app to discover, reserve, and collect it; authorized stakeholders see aggregate activity. The project combines marketplace coordination with promotion, descriptive analytics, advisories, and transaction-linked accountability.

> [!important] How to read this vault
> The capstone PDF describes the **target system**. [[Current Implementation]] records what is present in the local repository as inspected on 20 September 2026. A proposed feature should not be treated as shipped merely because it appears in the PDF.

## Start here

- [[Project Brief]] — one-page concept and value proposition
- [[Problem and Evidence]] — field findings and why the system exists
- [[Goals and Boundaries]] — objectives, scope, exclusions, and claims to avoid
- [[People and Roles]] — sellers, buyers, administrators, and stakeholders
- [[Product Journeys]] — end-to-end seller and buyer flows
- [[Feature Map]] — capabilities and requirement IDs

## Core mechanisms

- [[Reservation and QR Pickup]]
- [[Weighted Surplus Visibility]]
- [[Marketing Boost]]
- [[Market Basket Analysis]]
- [[Seller Analytics]]
- [[Contextual Advisories]]
- [[Trust and Flagging]]

## Build and validate

- [[Architecture and Integrations]]
- [[Current Implementation]]
- [[Landscape and Feasibility]]
- [[Delivery Roadmap]]
- [[Acceptance and Evaluation]]
- [[Open Decisions]]
- [[Source and Reading Guide]]
- [[2026-09-20 Vault Creation]] — creation and verification record

## Current focus

1. Align the implemented seller APIs with the fuller listing requirements and authorization rules.
2. Define the reservation state machine and quantity invariants before adding QR pickup.
3. Implement the visibility calculation against elapsed posting time, available stock, seller-declared inventory age, and recurrence.
4. Confirm proposal inconsistencies and configuration values in [[Open Decisions]].

**Source:** *CAPSTONE 2 FILES - BARTIQUIEN, JARA, MARUNDAN.pdf* (34 pages). Database tables, the entity-relationship diagram, and the data dictionary are deliberately excluded from this vault.
