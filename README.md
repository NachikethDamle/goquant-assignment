# 📊 GoQuant Backtesting Platform

Welcome to the GoQuant assignment submission — a full-stack backtesting platform built using FastAPI (backend) and React with TypeScript (frontend). This application allows users to visually construct trading strategies, run backtests on historical OHLCV data, and analyze comprehensive performance metrics.

## 📁 Project Structure

```
GoQuant-assignment/
├── goquant-backend/     # FastAPI backend
└── goquant-frontend/    # React + TypeScript frontend
```

## 🚀 Getting Started

This project runs the frontend and backend separately. Please follow the instructions below for each part.

## 🧠 Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or above)
- **Python** (3.8+)
- **pip** (for Python package management)

## ⚙️ Backend Setup (FastAPI)

### 📌 Location
Navigate to the `goquant-backend/` directory.

### 📥 Installation

```bash
cd goquant-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### ▶️ Running the Backend Server

```bash
uvicorn main:app --reload
```

The backend should now be running at: [http://localhost:8000](http://localhost:8000)

## 🖥️ Frontend Setup (React + TypeScript)

### 📌 Location
Navigate to the `goquant-frontend/` directory.

### 📥 Installation

```bash
cd goquant-frontend
npm install
```

### ▶️ Running the Frontend App

```bash
npm run dev
```

The frontend will be live at: [http://localhost:5173](http://localhost:5173)

> ⚠️ Ensure the backend is running on port `8000` before starting the frontend.

## 📈 How to Use the Application

1. **Signals Section**:  
   Add technical indicators (e.g., `EMA`, `RSI`, `MACD`) with respective parameters.

2. **Entry Conditions**:  
   Logical conditions for when a trade should be entered.

3. **Exit Conditions**:  
   Logical conditions for when a trade should be exited.

4. **Run Backtest**:  
   Click “🚀 Run Backtest” to execute and visualize the results (price chart, equity curve, buy/sell markers, and performance metrics).

## 🧠 Valid Strategy Inputs

This section helps reviewers understand how to configure strategies correctly.

### ✅ Supported Indicators

| Type | Format | Description |
|------|--------|-------------|
| EMA | `EMA_20` | Exponential Moving Average with period 20 |
| RSI | `RSI_14` | Relative Strength Index with period 14 |

> **Note:** The exact string format matters. Ensure proper underscore-separated values for MACD.

### ✅ Operators

| Symbol | Meaning |
|--------|---------|
| `>`    | Greater than |
| `<`    | Less than |
| `=`    | Equal to |
| `>=`   | Greater than or equal |
| `<=`   | Less than or equal |

### 📌 Examples

#### EMA Cross Strategy

- **Signals**:  
  - `EMA` with period `20`  
  - `EMA` with period `50`

- **Entry**: `EMA_20 > EMA_50`  
- **Exit**: `EMA_20 < EMA_50`

#### RSI Strategy

- **Signals**: `RSI` with period `14`  
- **Entry**: `RSI_14 < 30`  
- **Exit**: `RSI_14 > 70`



## 📊 Output Features

Once you run a backtest, the following will be rendered:

- ✅ Price Chart with Buy/Sell markers  
- ✅ Equity Curve on secondary Y-axis  
- ✅ Detailed Strategy Performance:
  - Total PnL
  - CAGR
  - Sharpe Ratio
  - Max Drawdown

## 🧪 Testing Strategy

Use the following sample to test quickly:

- **Signal**: `EMA`, `20`
- **Entry**: `EMA_20 > EMA_50`
- **Exit**: `EMA_20 < EMA_50`

## 🛠 Troubleshooting

- ❌ No chart? → Your strategy likely didn’t trigger any trades.
- ❌ Error in console? → Make sure backend and frontend are running correctly.

## 📚 API Endpoints

Backend provides a POST API:

```
POST /api/strategy/backtest?symbol=BTC-USDT&interval=1H
```

Payload:

```json
{
  "signals": [{ "type": "EMA", "period": 20 }],
  "entry_conditions": [{ "lhs": "EMA_20", "operator": ">", "rhs": "EMA_50" }],
  "exit_conditions": [{ "lhs": "EMA_20", "operator": "<", "rhs": "EMA_50" }]
}
```

## ✅ Final Notes

- Project meets core assignment requirements (strategy builder, backtest engine, analytics).
- Reviewers can build any supported strategy with valid inputs listed above.
- Code is modular and extendable.

## 📦 Dependencies Overview

### Backend

- `fastapi`
- `pandas`
- `httpx`
- `ta`

Install using:

```bash
pip install -r requirements.txt
```

### Frontend

- `react`
- `typescript`
- `chart.js`
- `react-chartjs-2`

Install using:

```bash
npm install
```

