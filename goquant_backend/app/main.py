from fastapi import FastAPI
from app.api.routes import router as api_router
from app.api.backtest import router as backtest_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="GoQuant Backtesting API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(backtest_router, prefix="/api")
