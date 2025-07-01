from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Union
from pydantic import BaseModel
import pandas as pd

from app.services.analytics import compute_buy_and_hold, compute_equity_drawdown, compute_performance_metrics

from ..services.ohlcv import get_ohlcv_data
from ..stratergy.engine import run_strategy

router = APIRouter()

# ✅ Define clean models for Swagger compatibility

class Signal(BaseModel):
    type: str
    period: int

class Condition(BaseModel):
    lhs: Union[str, float]
    operator: str
    rhs: Union[str, float]

class StrategyModel(BaseModel):
    signals: List[Signal]
    entry_conditions: List[Condition]
    exit_conditions: List[Condition]

@router.post("/strategy/backtest")
async def backtest_strategy(
    symbol: str = Query(...),
    interval: str = Query("1H"),
    strategy: StrategyModel = Body(...)
):
    try:
        ohlcv = await get_ohlcv_data(symbol, interval)
        df = pd.DataFrame([c.dict() for c in ohlcv])
        trades = run_strategy(df, strategy.dict())
        analytics = compute_performance_metrics(trades)
        buy_hold = compute_buy_and_hold(df)

        return {
            "trade_count": len(trades),
            "trades": trades,
            "performance": analytics,
            "benchmark": buy_hold
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {e}")

@router.post("/strategy/equity_curve")
async def equity_curve(
    symbol: str = Query(...),
    interval: str = Query("1H"),
    strategy: StrategyModel = Body(...)
):
    try:
        ohlcv = await get_ohlcv_data(symbol, interval)
        df = pd.DataFrame([c.dict() for c in ohlcv])
        trades = run_strategy(df, strategy.dict())
        equity_data = compute_equity_drawdown(trades)
        return equity_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Equity curve failed: {e}")