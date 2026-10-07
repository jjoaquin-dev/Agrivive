from __future__ import annotations

from datetime import date, timedelta
import json
from pathlib import Path
import random

import pandas as pd

from config import MbaConfig


PAIR_SCENARIOS = [
    ("Tomato", "Onion"),
    ("Potato", "Carrot"),
    ("Pechay", "Kangkong"),
    ("Eggplant", "String Beans"),
    ("Pechay", "Fresh Tomatoes"),
]


def _catalog(config: MbaConfig) -> pd.DataFrame:
    return pd.read_csv(config.synthetic_products_path).fillna("")


def generate_synthetic_dataset(config: MbaConfig) -> tuple[pd.DataFrame, dict[str, object]]:
    catalog = _catalog(config)
    rng = random.Random(config.synthetic_seed)
    products = catalog.to_dict("records")
    by_name = {str(item["product_name"]): item for item in products}
    all_names = list(by_name)
    rows: list[dict[str, object]] = []
    start = date(2026, 1, 1)

    for index in range(config.synthetic_baskets):
        basket_id = f"SYN-{index + 1:04d}"
        if rng.random() < 0.68:
            pair = rng.choice(PAIR_SCENARIOS)
            names = list(pair)
            if rng.random() < 0.18:
                names.append(rng.choice([name for name in all_names if name not in names]))
        else:
            size = rng.choices([1, 2, 3], weights=[0.45, 0.42, 0.13])[0]
            names = rng.sample(all_names, size)

        transaction_date = (start + timedelta(days=index % 84)).isoformat()
        for name in dict.fromkeys(names):
            product = by_name[name]
            rows.append({
                "basket_id": basket_id,
                "transaction_date": transaction_date,
                "product_id": product["product_id"],
                "product_name": product["product_name"],
                "category": product["category"],
                "quantity": rng.randint(1, 3),
                "status": "completed",
                "source": "synthetic",
            })

    # These rows verify that cancelled and incomplete records are excluded.
    rows.extend([
        {"basket_id": "SYN-CANCELLED", "transaction_date": "2026-01-01", "product_id": "AG-004", "product_name": "Tomato", "category": "Fruit Vegetables", "quantity": 1, "status": "cancelled", "source": "synthetic"},
        {"basket_id": "SYN-PENDING", "transaction_date": "2026-01-01", "product_id": "AG-010", "product_name": "Onion", "category": "Bulb and Stem Vegetables", "quantity": 1, "status": "pending", "source": "synthetic"},
    ])
    ground_truth = {
        "source": "synthetic",
        "seed": config.synthetic_seed,
        "plantedPairs": [list(pair) for pair in PAIR_SCENARIOS],
        "note": "Planted associations validate the pipeline and are not Agrivive market findings.",
    }
    return pd.DataFrame(rows), ground_truth


def write_synthetic_fixture(config: MbaConfig) -> dict[str, object]:
    frame, ground_truth = generate_synthetic_dataset(config)
    config.synthetic_transactions_path.parent.mkdir(parents=True, exist_ok=True)
    config.output_dir.mkdir(parents=True, exist_ok=True)
    frame.to_csv(config.synthetic_transactions_path, index=False)
    config.synthetic_ground_truth_path.write_text(json.dumps(ground_truth, indent=2), encoding="utf-8")
    return ground_truth


if __name__ == "__main__":
    write_synthetic_fixture(MbaConfig.from_env())
