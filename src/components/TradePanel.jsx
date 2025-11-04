import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STOCKS = [
  { name: 'Richtech Robotics', symbol: 'RRBT' },
  { name: 'SES AI', symbol: 'SES' },
  { name: 'BlackBerry', symbol: 'BB' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'Meta Platforms', symbol: 'META' },
  { name: 'Alphabet (Class A)', symbol: 'GOOGL' },
  { name: 'AMD', symbol: 'AMD' },
  { name: 'Netflix', symbol: 'NFLX' },
];

export default function TradePanel({ onCashChange, onTrade }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [side, setSide] = useState('BUY');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [cashAdj, setCashAdj] = useState('');

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return STOCKS.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const pick = (s) => {
    setSelected(s);
    setQuery(`${s.name} (${s.symbol})`);
  };

  const submitTrade = (e) => {
    e.preventDefault();
    if (!selected) return;
    const qn = Number(qty);
    const pr = Number(price);
    if (!qn || !pr) return;
    onTrade({ name: selected.name, symbol: selected.symbol, side, quantity: qn, price: pr });
    setQty('');
    setPrice('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#141431] to-[#0a0c17] p-6 shadow-xl shadow-violet-900/20">
        <h3 className="mb-4 text-white/90">Buy / Sell Stock</h3>
        <form onSubmit={submitTrade} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/60">Stock</label>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                placeholder="Search name or symbol..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <AnimatePresence>
                {suggestions.length > 0 && !selected && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f1222] shadow-lg"
                  >
                    {suggestions.map((s) => (
                      <li
                        key={s.symbol}
                        onClick={() => pick(s)}
                        className="cursor-pointer px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        <span className="text-white">{s.name}</span>
                        <span className="ml-2 text-white/50">{s.symbol}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-white/60">Side</label>
              <div className="flex rounded-xl bg-white/5 p-1">
                {['BUY', 'SELL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                      side === s ? 'bg-gradient-to-r from-violet-600/70 to-cyan-500/70 text-white' : 'text-white/70'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/60">Quantity</label>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                type="number"
                min="0"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/60">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                placeholder="0.00"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 font-medium text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110"
          >
            {side === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#141431] to-[#0a0c17] p-6 shadow-xl shadow-cyan-900/20">
        <h3 className="mb-4 text-white/90">Add Cash</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/60">Amount</label>
            <input
              value={cashAdj}
              onChange={(e) => setCashAdj(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="0.00"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const amt = Number(cashAdj || '0');
                if (amt > 0) onCashChange(amt);
                setCashAdj('');
              }}
              className="flex-1 rounded-xl bg-cyan-500/90 px-4 py-2 font-medium text-white shadow-lg shadow-cyan-900/30 transition hover:brightness-110"
            >
              Add Cash
            </button>
            <button
              onClick={() => {
                const amt = Number(cashAdj || '0');
                if (amt > 0) onCashChange(-amt);
                setCashAdj('');
              }}
              className="flex-1 rounded-xl bg-pink-500/90 px-4 py-2 font-medium text-white shadow-lg shadow-pink-900/30 transition hover:brightness-110"
            >
              Withdraw
            </button>
          </div>
          <p className="text-xs text-white/60">Tip: Charts update instantly after every action.</p>
        </div>
      </div>
    </motion.div>
  );
}
