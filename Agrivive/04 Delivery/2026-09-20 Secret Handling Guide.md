---
title: Secret Handling Guide
type: repository-guidance
status: current
date: 2026-09-20
---

# Secret Handling Guide

Updated the repository contributor guide to require every secret key, API token, password, database credential, and other sensitive configuration value to live in an ignored server-side `.env` file. The guide also warns that mobile and web `.env` values can be exposed in client builds and directs contributors to use placeholder-only `.env.example` files when documenting required variables.

**Why:** Keep credentials out of source code, tests, documentation, and commits.

**Affected file:** `AGENTS.md`.

**Verification:** Confirmed `backend/.env` is ignored by Git and reviewed the final contributor-guide wording. No secret values were read or copied.
