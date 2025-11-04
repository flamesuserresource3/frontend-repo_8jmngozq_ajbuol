import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Hero3D from './components/Hero3D.jsx';
import Tabs from './components/Tabs.jsx';
import PortfolioView from './components/PortfolioView.jsx';
import TradePanel from './components/TradePanel.jsx';

export default function App() {
  const [tab, setTab] = useState('portfolio');
  const [cash, setCash] = useState(10000);
  const [positions, setPositions] = useState({
    AAPL: { symbol: 'AAPL', name: 'Apple', shares: 5, price: 190 },
    NVDA: { symbol: 'NVDA', name: 'NVIDIA', shares: 2, price: 470 },
  });

  const totalValue = useMemo(() => {
    const invested = Object.values(positions).reduce((s, p) => s + p.shares * p.price, 0);
    return invested + cash;
  }, [positions, cash]);

  function handleBuy({ symbol, name, qty, price }) {
    setPositions((prev) => {
      const cur = prev[symbol] || { symbol, name, shares: 0, price };
      const totalShares = cur.shares + qty;
      const avgPrice = (cur.shares * cur.price + qty * price) / (totalShares || 1);
      return { ...prev, [symbol]: { symbol, name, shares: totalShares, price: Math.round(avgPrice * 100) / 100 } };
    });
    setCash((c) => Math.max(0, c - qty * price));
  }

  function handleSell({ symbol, name, qty, price }) {
    setPositions((prev) => {
      const cur = prev[symbol];
      if (!cur) return prev;
      const left = Math.max(0, cur.shares - qty);
      const next = { symbol, name: cur.name || name, shares: left, price: price };
      const clone = { ...prev };
      if (left === 0) delete clone[symbol]; else clone[symbol] = next;
      return clone;
    });
    setCash((c) => c + qty * price);
  }

  function handleCash(delta) {
    setCash((c) => Math.max(0, c + delta));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070a14] via-[#0b1020] to-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-slate-900 shadow-lg shadow-cyan-500/20">
              <Rocket size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold">NovaTrade</div>
              <div className="text-xs text-white/60">Fluid stock dashboard</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-white/60">Total</div>
            <div className="text-xl font-bold">${totalValue.toLocaleString()}</div>
          </div>
        </header>

        <Hero3D />

        <div className="mt-6 flex items-center justify-between gap-4">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'portfolio', label: 'Portfolio' },
              { value: 'stocks', label: 'Stocks' },
            ]}
          />
          <div className="hidden text-sm text-white/70 sm:block">Cash: ${cash.toLocaleString()}</div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {tab === 'portfolio' ? (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <PortfolioView positions={positions} cash={cash} />
              </motion.div>
            ) : (
              <motion.div
                key="stocks"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <TradePanel onBuy={handleBuy} onSell={handleSell} onCash={handleCash} />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-2 text-sm uppercase tracking-widest text-white/60">Activity</div>
                  <p className="text-white/70">Use the trade panel to simulate buys, sells, and cash movements. Your portfolio updates in real-time.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ambient grain */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-soft-light" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
    </div>
  );
}
