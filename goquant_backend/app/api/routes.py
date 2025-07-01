from fastapi import APIRouter, Query
from app.services.ohlcv import get_ohlcv_data

router = APIRouter()

@router.get("/ohlcv")
async def ohlcv(symbol: str = Query(...), interval: str = Query("1H")):
    return await get_ohlcv_data(symbol, interval)