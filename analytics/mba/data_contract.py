from collections.abc import Iterable
import pandas as pd

REQUIRED_COLUMNS = {
    "basket_id",
    "transaction_date",
    "product_id",
    "product_name",
    "category",
    "quantity",
    "status",
    "source",
}


def validate_frame(frame: pd.DataFrame) -> None:
    missing = REQUIRED_COLUMNS.difference(frame.columns)
    if missing:
        names = ", ".join(sorted(missing))
        raise ValueError(f"MBA input is missing columns: {names}")


def normalize_item(value: object) -> str:
    return " ".join(str(value).strip().casefold().split())


def item_value(row: pd.Series, item_level: str) -> str:
    raw = row[item_level]
    if pd.isna(raw):
        return ""
    return normalize_item(raw)


def build_baskets(frame: pd.DataFrame, item_level: str) -> tuple[dict[str, set[str]], dict[str, str]]:
    validate_frame(frame)
    completed = frame[frame["status"].astype(str).str.casefold() == "completed"]
    baskets: dict[str, set[str]] = {}
    display_names: dict[str, str] = {}

    for _, row in completed.iterrows():
        basket_id = str(row["basket_id"]).strip()
        item = item_value(row, item_level)
        if not basket_id or not item:
            continue
        baskets.setdefault(basket_id, set()).add(item)
        display_names.setdefault(item, str(row[item_level]).strip() or item)

    return baskets, display_names


def rows_from_records(records: Iterable[dict[str, object]]) -> pd.DataFrame:
    frame = pd.DataFrame(list(records))
    validate_frame(frame)
    return frame
