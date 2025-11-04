import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

const STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
];

export default function TradePanel({ onBuy, onSell }) {
  const [q, setQ] = useState('');
  const [qty, setQty] = useState(1);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STOCKS;
    return STOCKS.filter(
      (x) => x.ticker.toLowerCase().includes(s) || x.name.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2 w-full max-w-md">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stocks..."
            className="bg-transparent outline-none text-slate-200 placeholder:text-slate-500 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
            className="bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2 text-slate-200 w-24 text-right"
          />
          <span className="text-slate-400 text-sm">shares</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((s) => (
          <div key={s.ticker} className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{s.ticker}</p>
                <p className="text-slate-400 text-sm">{s.name}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onBuy(s.ticker, qty)}
                className="flex-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Buy
              </button>
              <button
                onClick={() => onSell(s.ticker, qty)}
                className="flex-1 px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-500"
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
