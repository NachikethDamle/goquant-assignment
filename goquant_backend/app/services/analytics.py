import pandas as pd
import numpy as np

def compute_performance_metrics(trades: list, initial_balance: float = 10000):
    if not trades or len(trades) < 2:
        return {"error": "Not enough trades to calculate performance."}

    df = pd.DataFrame(trades)

    # Convert timestamps for both overall trades and SELL trades
    df["timestamp"] = pd.to_datetime(df["timestamp"].apply(lambda x: int(str(x)[:13])), unit="ms")

    sells = df[df["type"] == "SELL"].copy()
    sells["pnl"] = pd.to_numeric(sells["pnl"], errors="coerce")
    sells.dropna(subset=["pnl"], inplace=True)

    sells.sort_values("timestamp", inplace=True)
    sells["timestamp"] = pd.to_datetime(sells["timestamp"])

    # Equity curve
    sells["equity"] = initial_balance + sells["pnl"].cumsum()
    sells["returns"] = sells["equity"].pct_change().fillna(0)

    # Core metrics
    total_return = sells["equity"].iloc[-1] - initial_balance
    total_return_pct = (total_return / initial_balance) * 100

    duration_days = (sells["timestamp"].iloc[-1] - sells["timestamp"].iloc[0]).days + 1
    CAGR = ((sells["equity"].iloc[-1] / initial_balance) ** (365 / duration_days)) - 1

    volatility = sells["returns"].std() * np.sqrt(252)
    sharpe = (CAGR - 0.03) / volatility if volatility != 0 else 0

    drawdown = sells["equity"].cummax() - sells["equity"]
    max_drawdown = drawdown.max()
    calmar = CAGR / (max_drawdown / initial_balance) if max_drawdown != 0 else 0

    # Avg trade duration
    df.sort_values("timestamp", inplace=True)
    avg_duration_secs = df["timestamp"].diff().mean().total_seconds()

    return {
        "total_pnl": round(total_return, 2),
        "total_pnl_pct": round(total_return_pct, 2),
        "cagr": round(CAGR * 100, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round((max_drawdown / initial_balance) * 100, 2),
        "max_drawdown": round(max_drawdown, 2),
        "calmar_ratio": round(calmar, 2),
        "volatility_pct": round(volatility * 100, 2),
        "trade_count": len(sells),
        "win_rate": round((sells["pnl"] > 0).sum() / len(sells) * 100, 2),
        "largest_win": round(sells["pnl"].max(), 2),
        "largest_loss": round(sells["pnl"].min(), 2),
        "avg_trade_duration_hrs": round(avg_duration_secs / 3600, 2)
    }
def compute_buy_and_hold(df: pd.DataFrame, initial_balance: float = 10000):
    df["timestamp"] = pd.to_datetime(df["timestamp"].apply(lambda x: int(str(x)[:13])), unit="ms")
    df = df.sort_values("timestamp")

    buy_price = df["close"].iloc[0]
    sell_price = df["close"].iloc[-1]

    # Buy entire position at start
    quantity = initial_balance / buy_price
    final_balance = quantity * sell_price
    pnl = final_balance - initial_balance
    pnl_pct = (pnl / initial_balance) * 100

    duration_days = (df["timestamp"].iloc[-1] - df["timestamp"].iloc[0]).days + 1
    CAGR = ((final_balance / initial_balance) ** (365 / duration_days)) - 1

    return {
        "buy_and_hold_pnl": round(pnl, 2),
        "buy_and_hold_pnl_pct": round(pnl_pct, 2),
        "buy_and_hold_cagr": round(CAGR * 100, 2),
    }
def compute_equity_drawdown(trades: list, initial_balance: float = 10000):
    if not trades:
        return {"error": "No trades to compute equity curve."}

    df = pd.DataFrame(trades)
    df["timestamp"] = pd.to_datetime(df["timestamp"].apply(lambda x: int(str(x)[:13])), unit="ms")
    df.sort_values("timestamp", inplace=True)

    equity = initial_balance
    equity_curve = []
    drawdown_curve = []

    peak = initial_balance

    for _, row in df.iterrows():
        if row["type"] == "SELL":
            equity += row["pnl"]

        peak = max(peak, equity)
        drawdown = peak - equity

        equity_curve.append({"timestamp": row["timestamp"].isoformat(), "equity": round(equity, 2)})
        drawdown_curve.append({"timestamp": row["timestamp"].isoformat(), "drawdown": round(drawdown, 2)})

    return {
        "equity_curve": equity_curve,
        "drawdown_curve": drawdown_curve
    }
