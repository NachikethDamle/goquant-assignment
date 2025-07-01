import pandas as pd
import pandas_ta as ta  # make sure pandas_ta is installed

def compute_indicators(df: pd.DataFrame, strategy: dict) -> pd.DataFrame:
    for rule in strategy.get("signals", []):
        typ = rule["type"]

        if typ == "EMA":
            period = rule["period"]
            df[f"EMA_{period}"] = ta.ema(df['close'], length=period)

        elif typ == "RSI":
            period = rule["period"]
            df[f"RSI_{period}"] = ta.rsi(df['close'], length=period)

        elif typ == "MACD":
            fast = rule.get("fast", 12)
            slow = rule.get("slow", 26)
            signal = rule.get("signal", 9)
            macd_df = ta.macd(df['close'], fast=fast, slow=slow, signal=signal)

            df[f"MACD_{fast}_{slow}_{signal}"] = macd_df.iloc[:, 0]
            df[f"MACDs_{fast}_{slow}_{signal}"] = macd_df.iloc[:, 1]

    return df
