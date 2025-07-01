from app.utils.okx_client import fetch_ohlcv
from app.models.schema import OHLCVResponse
from fastapi import HTTPException

async def get_ohlcv_data(symbol: str, interval: str) -> list[OHLCVResponse]:
    raw_data = await fetch_ohlcv(symbol, interval)
    if not raw_data:
        raise HTTPException(status_code=500, detail="Failed to fetch OHLCV")

    formatted = []
    for candle in raw_data:
        formatted.append(OHLCVResponse(
            timestamp=candle[0],
            open=float(candle[1]),
            high=float(candle[2]),
            low=float(candle[3]),
            close=float(candle[4]),
            volume=float(candle[5]),
            turnover=float(candle[6]),
            quote_volume=float(candle[7]),
            complete=bool(int(candle[8]))
        ))

    return formatted