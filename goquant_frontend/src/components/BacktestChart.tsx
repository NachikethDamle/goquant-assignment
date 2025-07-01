import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { BacktestPoint } from './StrategyBuilder';
import type { ChartOptions } from 'chart.js';

type Performance = {
  total_pnl: number;
  total_pnl_pct: number;
  cagr: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
};

type Props = {
  trades: BacktestPoint[];
  performance?: Performance; // new optional performance prop
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function BacktestChart({ trades, performance }: Props) {
  const labels = trades.map(t => new Date(t.timestamp).toLocaleString());

  // ✅ Original data preserved
  const priceData = trades.map(t => ({
    x: new Date(t.timestamp).toLocaleString(),
    y: t.price
  }));

  // ✅ Equity Curve addition
  const equityCurveData = trades.map(t => ({
    x: new Date(t.timestamp).toLocaleString(),
    y: t.equity
  }));

  // ✅ Buy/Sell markers (added on top)
  const markerData = trades
    .filter(t => t.type === 'BUY' || t.type === 'SELL')
    .map(t => ({
      x: new Date(t.timestamp).toLocaleString(),
      y: t.price,
      type: t.type
    }));

  // ✅ Final combined dataset
  const data: any = {
    labels,
    datasets: [
      {
        label: 'Trade Price',
        data: priceData,
        borderColor: 'blue',
        backgroundColor: 'transparent',
        fill: false,
        parsing: false,
        yAxisID: 'y',
      },
      {
        label: 'Equity Curve',
        data: equityCurveData,
        borderColor: 'green',
        backgroundColor: 'transparent',
        fill: false,
        parsing: false,
        yAxisID: 'y1',
      },
      {
        label: 'Buy/Sell',
        data: markerData,
        parsing: false,
        showLine: false,
        pointStyle: markerData.map(d => (d.type === 'BUY' ? 'triangle' : 'rectRot')),
        pointBackgroundColor: markerData.map(d => (d.type === 'BUY' ? 'green' : 'red')),
        pointRadius: markerData.map(() => 6),
        borderColor: 'transparent'
      }
    ]
  };

  // ✅ Your original chart config + y1 axis for equity curve
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        title: { display: true, text: 'Timestamp' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Price' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Equity' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📈 Backtest Chart</h2>
      <Line data={data} options={options} />

      {performance && performance.total_pnl !== undefined && (
        <div style={{ marginTop: '1rem', padding: '10px', border: '1px solid #ccc' }}>
          <h3>📊 Strategy Performance</h3>
          <p>Total PnL: ₹{performance.total_pnl.toFixed(2)}</p>
          <p>Total PnL %: {performance.total_pnl_pct.toFixed(2)}%</p>
          <p>CAGR: {performance.cagr.toFixed(2)}%</p>
          <p>Sharpe Ratio: {performance.sharpe_ratio.toFixed(2)}</p>
          <p>Max Drawdown: {performance.max_drawdown_pct.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
