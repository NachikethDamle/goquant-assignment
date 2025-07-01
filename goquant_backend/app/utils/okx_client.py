import httpx
from typing import Optional

async def fetch_ohlcv(symbol: str, interval: str, limit: int = 300) -> Optional[list]:
    url = f"https://www.okx.com/api/v5/market/candles"
    params = {
        "instId": symbol,
        "bar": interval,
        "limit": str(limit)
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json().get("data", [])
        except httpx.HTTPError as e:
            print(f"Error fetching OHLCV data: {e}")
            return None