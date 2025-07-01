from __future__ import annotations
from pydantic import BaseModel
from typing import List

class OHLCVResponse(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    turnover: float
    quote_volume: float
    complete: bool
