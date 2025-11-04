import React, { useMemo, useState } from 'react';
import Hero3D from './components/Hero3D.jsx';
import Tabs from './components/Tabs.jsx';
import PortfolioView from './components/PortfolioView.jsx';
import TradePanel from './components/TradePanel.jsx';

export default function App() {
  const [tab, setTab] = useState('portfolio');
  const [cash, setCash] = useState(12500);
  const [positions, setPositions] = useState([
    { ticker: 'AAPL', shares: 20, avgCost: 155.4, value: 3400, color: '#a78bfa' },
    { ticker: 'MSFT', shares: 10, avgCost: 310.1, value: 3300, color: '#60a5fa' },
    { ticker: 'NVDA', shares: 5, avgCost: 420.2, value: 2400, color: '#34d399' },
  ]);

  const onBuy = (ticker, qty) => {
    const price = 100; // simple demo price
    const cost = price * qty;
    if (cost > cash) return alert('Not enough cash');
    setCash((c) => c - cost);
    setPositions((prev) => {
      const idx = prev.findIndex((p) => p.ticker === ticker);
      if (idx === -1) {
        return [
          ...prev,
          {
            ticker,
            shares: qty,
            avgCost: price,
            value: qty * price,
            color: '#f472b6',
          },
        ];
      }
      const p = prev[idx];
      const newShares = p.shares + qty;
      const newAvg = (p.avgCost * p.shares + price * qty) / newShares;
      const updated = { ...p, shares: newShares, avgCost: newAvg, value: newShares * price };
      return prev.map((x, i) => (i === idx ? updated : x));
    });
  };

  const onSell = (ticker, qty) => {
    setPositions((prev) => {
      const idx = prev.findIndex((p) => p.ticker === ticker);
      if (idx === -1) return prev;
      const p = prev[idx];
      const sellQty = Math.min(qty, p.shares);
      const price = 100; // demo price
      const newShares = p.shares - sellQty;
      setCash((c) => c + sellQty * price);
      if (newShares <= 0) {
        return prev.filter((x) => x.ticker !== ticker);
      }
      const updated = { ...p, shares: newShares, value: newShares * price };
      return prev.map((x, i) => (i === idx ? updated : x));
    });
  };

  const holdings = useMemo(() => positions, [positions]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <Hero3D />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-semibold">Dashboard</h2>
            <p className="text-slate-400 text-sm">Your portfolio and trading workspace</p>
          </div>
          <Tabs value={tab} onChange={setTab} />
        </div>

        {tab === 'portfolio' ? (
          <PortfolioView cash={cash} holdings={holdings} />
        ) : (
          <TradePanel onBuy={onBuy} onSell={onSell} />
        )}
      </div>
    </div>
  );
}
