# Agrivive Market Basket Analysis

This package demonstrates Market Basket Analysis (MBA) with synthetic Agrivive-style baskets and provides a read-only path for future real completed orders.

## Modes

Set `MBA_MODE` before running:

- `disabled`: writes an empty disabled report.
- `synthetic`: generates 500 deterministic demo baskets and writes a demo report.
- `live`: reads completed orders and ordered items from PostgreSQL without writing to the database.

Synthetic mode is rejected when `APP_ENV=production`. Outside production, its associations may power clearly labeled buyer demo recommendations that resolve to real, currently available marketplace listings. Synthetic associations must never be presented as real buyer behavior or used for marketing actions.

## Local run

From the repository root:

```powershell
python -m pip install -r analytics/mba/requirements.txt
$env:MBA_MODE = "synthetic"
python analytics/mba/run_mba.py
```

When `backend/.env` exists, the runner reads its non-secret configuration values locally. Explicit process environment variables take precedence. The runner never prints environment values.

The generated files are:

- `analytics/mba/fixtures/synthetic_transactions.csv`
- `analytics/mba/output/synthetic_ground_truth.json`
- `analytics/mba/output/synthetic_mba_report.json`

The planted associations are test fixtures. They are not findings about real Agrivive buyers.

The Pechay and Fresh Tomatoes fixture pair matches two currently available marketplace product names for local buyer-page demonstrations. Product-name rules require matching listing names; if either listing is renamed or unavailable, the buyer page correctly hides that suggestion. Restart the local API after changing `MBA_MODE` in `backend/.env`.

## Live run

Set `MBA_MODE=live` and provide the existing server-side `DATABASE_URL`. The query reads only completed orders and their ordered items. If the usable basket count is below `MBA_MIN_COMPLETED_BASKETS`, the report stays in `collecting` status and contains no rules.

## Research basis

- Agrawal, Imieliński, and Swami (1993), *Mining Association Rules Between Sets of Items in Large Databases*.
- Li, Ning, Wang, and Jajodia (2001), *Generating Market Basket Data with Temporal Information*.
- Qisman, Rosadi, and Abdullah (2021), *Market Basket Analysis Using Apriori Algorithm to Find Consumer Patterns in Buying Goods Through Transaction Data*.
- Zhao, Xu, and Zhang (2021), *CTAB-GAN: Effective Table Data Synthesizing*.
- Mendikowski and Hartwig (2022), *Creating Customers That Never Existed: Synthesis of E-commerce Data Using CTGAN*.

The synthetic generator is rule-based because model-based synthesizers need a real source distribution to learn from. Future live analysis will use real completed Agrivive orders instead of synthetic fixtures.
