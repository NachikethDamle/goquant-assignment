import pandas as pd
from .indicators import compute_indicators
from .evaluator import evaluate_condition

def run_strategy(df: pd.DataFrame, strategy: dict):
    df = compute_indicators(df.copy(), strategy)

    trades = []
    in_position = False
    entry_price = 0.0

    for idx, row in df.iterrows():
        try:
            entry_cond = all(evaluate_condition(row, c) for c in strategy["entry_conditions"])
            exit_cond = all(evaluate_condition(row, c) for c in strategy["exit_conditions"])
        except KeyError as e:
            raise ValueError(f"Missing indicator in DataFrame: {e}")
        except ValueError as ve:
            raise ValueError(f"Invalid condition evaluation: {ve}")

        if not in_position and entry_cond:
            in_position = True
            entry_price = float(row["close"])
            trades.append({
                "type": "BUY",
                "timestamp": int(row["timestamp"]),
                "price": float(row["close"])
            })

        elif in_position and exit_cond:
            in_position = False
            trades.append({
                "type": "SELL",
                "timestamp": int(row["timestamp"]),
                "price": float(row["close"]),
                "pnl": float(row["close"]) - float(entry_price)
            })

    return trades
