import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus } from 'lucide-react';

const UNIVERSE = [
  { symbol: 'RR', name: 'Richtech Robotics' },
  { symbol: 'SES', name: 'SES AI' },
  { symbol: 'BB', name: 'BlackBerry' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NVDA', name: 'NVIDIA' },
];

export default function TradePanel({ onBuy, onSell, onCash }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(100);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return UNIVERSE.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q));
  }, [query]);

  function onKeyDown(e) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = results[active];
      if (pick) setQuery(pick.symbol);
    }
  }

  const selected = results[active] || UNIVERSE[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative grow">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search stocks (AAPL, NVDA...)"
            className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-10 pr-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <AnimatePresence>
            {query && results.length > 0 && (
              <motion.ul
                ref={listRef}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur"
              >
                {results.map((s, i) => (
                  <li
                    key={s.symbol}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setQuery(s.symbol)}
                    className={`cursor-pointer px-3 py-2 text-sm ${i === active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-white/80">{s.name}</span>
                    <span className="float-right font-mono text-white/60">{s.symbol}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-white/60">Symbol</label>
          <input
            value={selected?.symbol || ''}
            readOnly
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-white/60">Qty</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-white/60">Price</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => onBuy({ symbol: selected.symbol, name: selected.name, qty, price })}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Buy
        </button>
        <button
          onClick={() => onSell({ symbol: selected.symbol, name: selected.name, qty, price })}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
        >
          Sell
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onCash(500)}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300"
          >
            <Plus size={16} /> Add $500
          </button>
          <button
            onClick={() => onCash(-500)}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-300"
          >
            <Minus size={16} /> Withdraw $500
          </button>
        </div>
      </div>
    </div>
  );
}
