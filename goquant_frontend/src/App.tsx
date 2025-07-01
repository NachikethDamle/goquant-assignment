import React from 'react';
import StrategyBuilder from './components/StrategyBuilder';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>✅ GoQuant Strategy Builder</h1>
      <StrategyBuilder />
    </div>
  );
}