from dataclasses import dataclass
from pathlib import Path
import os
from typing import Literal

MbaMode = Literal["disabled", "synthetic", "live"]
ItemLevel = Literal["product_name", "category", "product_id"]
PROJECT_ROOT = Path(__file__).resolve().parents[2]


class ConfigError(ValueError):
    """Raised when MBA configuration cannot be used safely."""


def _int_env(name: str, default: int) -> int:
    value = os.getenv(name, str(default)).strip()
    try:
        return int(value)
    except ValueError as error:
        raise ConfigError(f"{name} must be an integer") from error


def _float_env(name: str, default: float) -> float:
    value = os.getenv(name, str(default)).strip()
    try:
        return float(value)
    except ValueError as error:
        raise ConfigError(f"{name} must be a number") from error


def _load_backend_env() -> None:
    env_path = PROJECT_ROOT / "backend" / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip().removeprefix("export ")
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


@dataclass(frozen=True)
class MbaConfig:
    mode: MbaMode
    item_level: ItemLevel
    min_completed_baskets: int
    min_pair_count: int
    min_support: float
    min_confidence: float
    min_lift: float
    max_itemset_size: int
    synthetic_baskets: int
    synthetic_seed: int
    output_dir: Path
    synthetic_products_path: Path
    synthetic_transactions_path: Path
    synthetic_ground_truth_path: Path

    @classmethod
    def from_env(cls) -> "MbaConfig":
        _load_backend_env()
        mode = os.getenv("MBA_MODE", "disabled").strip().lower()
        item_level = os.getenv("MBA_ITEM_LEVEL", "product_name").strip().lower()
        if mode not in {"disabled", "synthetic", "live"}:
            raise ConfigError("MBA_MODE must be disabled, synthetic, or live")
        if item_level not in {"product_name", "category", "product_id"}:
            raise ConfigError("MBA_ITEM_LEVEL must be product_name, category, or product_id")

        app_env = os.getenv("APP_ENV", os.getenv("NODE_ENV", "development")).strip().lower()
        if mode == "synthetic" and app_env == "production":
            raise ConfigError("Synthetic MBA mode is not allowed in production")

        config = cls(
            mode=mode,  # type: ignore[arg-type]
            item_level=item_level,  # type: ignore[arg-type]
            min_completed_baskets=_int_env("MBA_MIN_COMPLETED_BASKETS", 500),
            min_pair_count=_int_env("MBA_MIN_PAIR_COUNT", 5),
            min_support=_float_env("MBA_MIN_SUPPORT", 0.02),
            min_confidence=_float_env("MBA_MIN_CONFIDENCE", 0.25),
            min_lift=_float_env("MBA_MIN_LIFT", 1.10),
            max_itemset_size=_int_env("MBA_MAX_ITEMSET_SIZE", 2),
            synthetic_baskets=_int_env("MBA_SYNTHETIC_BASKETS", 500),
            synthetic_seed=_int_env("MBA_SYNTHETIC_SEED", 42),
            output_dir=PROJECT_ROOT / "analytics" / "mba" / "output",
            synthetic_products_path=PROJECT_ROOT / "analytics" / "mba" / "fixtures" / "synthetic_products.csv",
            synthetic_transactions_path=PROJECT_ROOT / "analytics" / "mba" / "fixtures" / "synthetic_transactions.csv",
            synthetic_ground_truth_path=PROJECT_ROOT / "analytics" / "mba" / "output" / "synthetic_ground_truth.json",
        )
        if config.min_completed_baskets < 1 or config.min_pair_count < 1:
            raise ConfigError("MBA basket and pair thresholds must be positive")
        if not 0 < config.min_support <= 1 or not 0 < config.min_confidence <= 1:
            raise ConfigError("MBA support and confidence must be between 0 and 1")
        if config.min_lift <= 0 or config.max_itemset_size != 2:
            raise ConfigError("MBA lift must be positive and the MVP itemset size must be 2")
        return config
