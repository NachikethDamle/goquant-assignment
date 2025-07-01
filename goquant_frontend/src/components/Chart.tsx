// src/components/Chart.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function Chart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/strategy/equity_curve?symbol=BTC-USDT&interval=1H', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
      .then(res => {
        const labels = res.map((point: any) =>
          new Date(point.timestamp).toLocaleString()
        );
        const equity = res.map((point: any) => point.equity);
        setData({
          labels,
          datasets: [
            {
              label: 'Equity Curve',
              data: equity,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        });
      });
  }, []);

  if (!data) return <p>📉 Loading equity curve...</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>📊 Equity Curve</h2>
      <Line data={data} />
    </div>
  );
}
