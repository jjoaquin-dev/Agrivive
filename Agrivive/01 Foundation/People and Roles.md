---
title: People and Roles
type: product
status: proposed
source_pages: [4, 6, 7]
---

# People and Roles

## Seller

Verified supplier, supplier-vendor, or retail vendor. Primarily uses the mobile app. Creates and updates marketable surplus listings, declares condition and inventory age, manages stock and price, receives inquiries and reservations, scans QR codes, confirms handover, and reviews analytics and advisories. A seller may also act as a buyer.

## Buyer

Household consumer, reseller, or food-related business. Primarily uses the web app. Searches and filters listings, checks seller and product information, messages a seller, reserves a quantity, receives a 24-hour QR code, navigates to pickup, and can rate or report a completed interaction.

## Administrator

Manages verification, users, listings, and trust or report handling. The PDF discusses administrator functions and a web application, but its formal user-requirements section lists three roles: sellers, buyers, and stakeholders. Administrator permissions need a dedicated decision. [[Open Decisions]]

## Authorized stakeholder

Representative of the City Agriculturist's Office, City Economic Enterprises Office, or another approved office. Receives the most restricted view: aggregated, non-personally identifiable marketplace information for monitoring and planning. No access to private messages, contact details, or protected transaction records.

## Public guest

The use-case description includes a public guest who may view public marketplace information and register. Clarify exactly which listings or aggregate views are public before implementation. [[Open Decisions]]

## Access principle

Every protected page, mobile action, and API request needs role checks. Overlapping seller/buyer roles should be supported deliberately, while stakeholder access remains aggregate-only. [[Feature Map]]

**Source:** PDF pp. 4, 6–7, 23.
