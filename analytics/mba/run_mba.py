from __future__ import annotations

import json
import os
from pathlib import Path
import sys

import pandas as pd
import psycopg

from config import MbaConfig
from generate_synthetic import write_synthetic_fixture
from mba_engine import analyze


LIVE_QUERY = """
SELECT
  o.id::text AS basket_id,
  COALESCE(o.completed_at, o.updated_at, o.created_at)::text AS transaction_date,
  oi.product_id::text AS product_id,
  COALESCE(NULLIF(trim(oi.product_name), ''), sp.product_name) AS product_name,
  sp."productType"::text AS category,
  oi.quantity::text AS quantity,
  'completed' AS status,
  'real' AS source
FROM orders o
JOIN ordered_items oi ON oi.orders_id = o.id
JOIN sellers_product sp ON sp.id = oi.product_id
WHERE o.status = 'completed'
ORDER BY o.id, oi.id
"""


def _load_live_frame() -> pd.DataFrame:
    database_url = os.getenv("DATABASE_URL", "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL is required when MBA_MODE=live")
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(LIVE_QUERY)
            rows = cursor.fetchall()
            columns = [column.name for column in cursor.description]
    return pd.DataFrame(rows, columns=columns)


def _write_report(config: MbaConfig, report: dict[str, object]) -> Path:
    config.output_dir.mkdir(parents=True, exist_ok=True)
    path = config.output_dir / f"{report['source']}_mba_report.json"
    path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return path


def run() -> Path:
    config = MbaConfig.from_env()
    if config.mode == "disabled":
        report = {
            "source": "none",
            "status": "disabled",
            "rules": [],
            "note": "MBA is disabled by MBA_MODE.",
        }
        return _write_report(config, report)

    if config.mode == "synthetic":
        write_synthetic_fixture(config)
        frame = pd.read_csv(config.synthetic_transactions_path)
        report = analyze(frame, config, "synthetic")
    else:
        report = analyze(_load_live_frame(), config, "real")
    return _write_report(config, report)


if __name__ == "__main__":
    try:
        output_path = run()
        print(f"MBA report written to {output_path}")
    except (RuntimeError, ValueError) as error:
        print(f"MBA failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
