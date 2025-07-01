import React, { useState } from 'react';
import BacktestChart from './BacktestChart';


export type BacktestPoint = {
  timestamp: number;
  price: number;
  equity: number;
  type?: 'BUY' | 'SELL';
  pnl?: number;

};
interface Performance {
  total_pnl: number;
  total_pnl_pct: number;
  cagr: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
}

interface BacktestData {
  trades: BacktestPoint[];
  performance: Performance;
}


const emptyCondition = { lhs: '', operator: '', rhs: '' };
const emptySignal = { type: '', period: 0 };

export default function StrategyBuilder() {
  const [signals, setSignals] = useState([{ ...emptySignal }]);
  const [entryConditions, setEntryConditions] = useState([{ ...emptyCondition }]);
  const [exitConditions, setExitConditions] = useState([{ ...emptyCondition }]);
  const [backtestData, setBacktestData] = useState<BacktestData | null>(null);


  const handleChange = (setter: any, index: number, field: string, value: string | number) => {
    setter((prev: any[]) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRow = (setter: any, emptyObj: object) => {
    setter((prev: any[]) => [...prev, { ...emptyObj }]);
  };

  const submit = async () => {
  const allConditions = [...entryConditions, ...exitConditions];
  const derivedSignals: { type: string; period: number }[] = [];
  allConditions.forEach(cond => {
    const keys = [cond.lhs, cond.rhs];
    keys.forEach(key => {
      if (typeof key === 'string' && key.startsWith('EMA_')) {
        const period = parseInt(key.split('_')[1]);
        if (!signals.some(s => s.type === 'EMA' && s.period === period)) {
          derivedSignals.push({ type: 'EMA', period });
        }
      }
      if (typeof key === 'string' && key.startsWith('RSI_')) {
        const period = parseInt(key.split('_')[1]);
        if (!signals.some(s => s.type === 'RSI' && s.period === period)) {
          derivedSignals.push({ type: 'RSI', period });
        }
      }
      if (typeof key === 'string' && key.startsWith('MACD_')) {
        // Optional: parse MACD_12_26_9 if needed
      }
    });
  });

  const finalSignals = [...signals, ...derivedSignals];

  const payload = {
    signals: finalSignals.map(s => ({ type: s.type.toUpperCase(), period: Number(s.period) })),
    entry_conditions: entryConditions.map(c => ({
      lhs: c.lhs,
      operator: c.operator,
      rhs: isNaN(Number(c.rhs)) ? c.rhs : Number(c.rhs)
    })),
    exit_conditions: exitConditions.map(c => ({
      lhs: c.lhs,
      operator: c.operator,
      rhs: isNaN(Number(c.rhs)) ? c.rhs : Number(c.rhs)
    }))
  };

  try {
    const res = await fetch('http://localhost:8000/api/strategy/backtest?symbol=BTC-USDT&interval=1H', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Backtest failed');
    const data = await res.json();
    console.log('✅ Backtest Result:', data);
    const derivedTrades = data.trades.map((trade: any) => ({
        timestamp: trade.timestamp || Date.now(),  // fallback if backend doesn’t return timestamp
        price: trade.price,
        equity: trade.equity,
        type: trade.type,
        pnl: trade.pnl
      }));

    setBacktestData({
        trades: derivedTrades,
        performance: data.performance
      });

      
    alert('✅ Backtest successful! See console for result');


      // Convert trade data to chart format
      const chartData = data.trades.map((t: any, idx: number) => ({
        timestamp: idx + 1,
        equity: t.equity,
        price: t.price
        }));
  } catch (err) {
    console.error('❌ Error running backtest:', err);
    alert('❌ Error running backtest');
  }
};



  return (
    <div style={{ padding: 20 }}>
      <h2>Signals</h2>
      {signals.map((sig, idx) => (
        <div key={idx}>
          <input
            placeholder="Type (EMA/RSI)"
            value={sig.type}
            onChange={(e) => handleChange(setSignals, idx, 'type', e.target.value)}
          />
          <input
            type="number"
            placeholder="Period"
            value={sig.period}
            onChange={(e) => handleChange(setSignals, idx, 'period', Number(e.target.value))}
          />
        </div>
      ))}
      <button onClick={() => addRow(setSignals, emptySignal)}>➕ Add Signal</button>

      <h2>Entry Conditions</h2>
      {entryConditions.map((cond, idx) => (
        <div key={idx}>
          <input
            placeholder="LHS"
            value={cond.lhs}
            onChange={(e) => handleChange(setEntryConditions, idx, 'lhs', e.target.value)}
          />
          <input
            placeholder="Operator"
            value={cond.operator}
            onChange={(e) => handleChange(setEntryConditions, idx, 'operator', e.target.value)}
          />
          <input
            placeholder="RHS"
            value={cond.rhs}
            onChange={(e) => handleChange(setEntryConditions, idx, 'rhs', e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => addRow(setEntryConditions, emptyCondition)}>➕ Add Entry Condition</button>

      <h2>Exit Conditions</h2>
      {exitConditions.map((cond, idx) => (
        <div key={idx}>
          <input
            placeholder="LHS"
            value={cond.lhs}
            onChange={(e) => handleChange(setExitConditions, idx, 'lhs', e.target.value)}
          />
          <input
            placeholder="Operator"
            value={cond.operator}
            onChange={(e) => handleChange(setExitConditions, idx, 'operator', e.target.value)}
          />
          <input
            placeholder="RHS"
            value={cond.rhs}
            onChange={(e) => handleChange(setExitConditions, idx, 'rhs', e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => addRow(setExitConditions, emptyCondition)}>➕ Add Exit Condition</button>

      <hr />
      <button onClick={submit}>🚀 Run Backtest</button>
      {backtestData && (
  <BacktestChart trades={backtestData.trades} performance={backtestData.performance} />
)}
    </div>
  );
}
