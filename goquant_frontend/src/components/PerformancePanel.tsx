// src/components/PerformancePanel.tsx
import React, { useEffect, useState } from 'react';

export default function PerformancePanel() {
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/strategy/backtest?symbol=BTC-USDT&interval=1H', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signals: [
          { type: 'EMA', period: 20 },
          { type: 'RSI', period: 14 }
        ],
        entry_conditions: [
          { lhs: 'EMA_20', operator: '>', rhs: 'RSI_14' }
        ],
        exit_conditions: [
          { lhs: 'RSI_14', operator: '>', rhs: 70 }
        ]
      })
    })
      .then(res => res.json())
      .then(res => setPerformance(res.performance));
  }, []);

  if (!performance) return <p>📈 Loading performance metrics...</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h2>📋 Performance Metrics</h2>
      <ul>
        {Object.entries(performance).map(([key, value]) => (
            <li key={key}><strong>{key}</strong>: {String(value)}</li>
        ))}
      </ul>
    </div>
  );
}
