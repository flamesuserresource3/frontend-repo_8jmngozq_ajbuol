import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

function DonutChart({ segments }) {
  // segments: [{ value: number, color: string }]
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  let cumulative = 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#1f2937"
        strokeWidth="14"
        fill="none"
      />
      {segments.map((s, i) => {
        const proportion = (s.value || 0) / total;
        const length = proportion * circumference;
        const dashArray = `${length} ${circumference - length}`;
        const dashOffset = circumference - cumulative * circumference;
        cumulative += proportion;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={radius}
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            fill="none"
          />
        );
      })}
      {/* center */}
      <circle cx="50" cy="50" r="24" fill="#0b1220" />
    </svg>
  );
}

export default function PortfolioView({ cash, holdings }) {
  const invested = holdings.reduce((s, h) => s + h.value, 0);
  const total = cash + invested;
  const allocation = [
    ...holdings.map((h) => ({ value: h.value, color: h.color })),
    cash > 0 ? { value: cash, color: '#0ea5e9' } : null,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-300">Total Balance</p>
                <p className="text-white text-2xl font-semibold">${total.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-300">Invested</p>
              <p className="text-white text-xl">${invested.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <DonutChart segments={allocation} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              {holdings.map((h) => (
                <div key={h.ticker} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className="text-slate-300">{h.ticker}</span>
                  <span className="text-slate-400">${h.value.toLocaleString()}</span>
                </div>
              ))}
              {cash > 0 && (
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span className="text-slate-300">CASH</span>
                  <span className="text-slate-400">${cash.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-slate-300">Holdings</p>
              <p className="text-slate-400 text-sm">Top positions by value</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300 text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2">Ticker</th>
                  <th className="py-2">Shares</th>
                  <th className="py-2">Avg Cost</th>
                  <th className="py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-t border-white/5">
                    <td className="py-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: h.color }} />
                      {h.ticker}
                    </td>
                    <td className="py-2">{h.shares}</td>
                    <td className="py-2">${h.avgCost.toFixed(2)}</td>
                    <td className="py-2">${h.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-slate-300">Cash Available</p>
          <p className="text-white text-2xl font-semibold mt-1">${cash.toLocaleString()}</p>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-500">Add Cash</button>
            <button className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700">Withdraw</button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-slate-400 text-sm">Tip</p>
          <p className="text-slate-300 mt-2">Use the Trade tab to search symbols and simulate buy/sell actions.</p>
        </div>
      </div>
    </div>
  );
}
