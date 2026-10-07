from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from itertools import combinations
from typing import Any

import pandas as pd

from config import MbaConfig
from data_contract import build_baskets


def analyze(frame: pd.DataFrame, config: MbaConfig, source: str) -> dict[str, Any]:
    baskets, display_names = build_baskets(frame, config.item_level)
    basket_count = len(baskets)
    status = "demo" if source == "synthetic" else "collecting"
    rules: list[dict[str, Any]] = []

    if source == "real" and basket_count >= config.min_completed_baskets:
        status = "ready"

    if basket_count and (source == "synthetic" or basket_count >= config.min_completed_baskets):
        item_counts = Counter(item for basket in baskets.values() for item in basket)
        pair_counts = Counter(
            pair
            for basket in baskets.values()
            for pair in combinations(sorted(basket), 2)
        )
        for (left, right), pair_count in pair_counts.items():
            if pair_count < config.min_pair_count:
                continue
            support = pair_count / basket_count
            if support < config.min_support:
                continue
            for antecedent, consequent in ((left, right), (right, left)):
                confidence = pair_count / item_counts[antecedent]
                consequent_support = item_counts[consequent] / basket_count
                lift = confidence / consequent_support if consequent_support else 0
                if confidence < config.min_confidence or lift < config.min_lift:
                    continue
                rules.append({
                    "antecedent": [display_names[antecedent]],
                    "consequent": [display_names[consequent]],
                    "support": round(support, 6),
                    "confidence": round(confidence, 6),
                    "lift": round(lift, 6),
                    "pairCount": pair_count,
                })

    rules.sort(key=lambda rule: (rule["lift"], rule["confidence"], rule["support"]), reverse=True)
    return {
        "source": source,
        "status": status,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "basketCount": basket_count,
        "uniqueItemCount": len({item for basket in baskets.values() for item in basket}),
        "itemLevel": config.item_level,
        "excludedStatuses": ["cancelled", "expired", "pending"],
        "thresholds": {
            "minCompletedBaskets": config.min_completed_baskets,
            "minPairCount": config.min_pair_count,
            "minSupport": config.min_support,
            "minConfidence": config.min_confidence,
            "minLift": config.min_lift,
        },
        "rules": rules,
    }
