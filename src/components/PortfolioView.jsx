import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const arcs = useMemo(() => {
    let acc = 0;
    return data.map((d, i) => {
      const start = (acc / total) * Math.PI * 2;
      acc += d.value;
      const end = (acc / total) * Math.PI * 2;
      const large = end - start > Math.PI ? 1 : 0;
      const r = 64;
      const cx = 80, cy = 80;
      const sx = cx + r * Math.cos(start);
      const sy = cy + r * Math.sin(start);
      const ex = cx + r * Math.cos(end);
      const ey = cy + r * Math.sin(end);
      const path = `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
      return { path, i };
    });
  }, [data, total]);

  const colors = ['#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <svg viewBox="0 0 160 160" className="h-48 w-48">
      <circle cx="80" cy="80" r="64" stroke="#0f172a" strokeWidth="24" fill="none" />
      {arcs.map((a, idx) => (
        <path
          key={idx}
          d={a.path}
          stroke={colors[idx % colors.length]}
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <circle cx="80" cy="80" r="40" fill="#0b1020" />
      <text x="80" y="84" textAnchor="middle" className="fill-white text-sm font-semibold">
        {Math.round((total) * 100) / 100}
      </text>
    </svg>
  );
}

export default function PortfolioView({ positions, cash }) {
  const invested = Object.values(positions).reduce((s, p) => s + p.shares * p.price, 0);
  const total = invested + cash;
  const data = Object.values(positions).map((p) => ({ label: p.name, value: p.shares * p.price }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
        <div className="flex flex-col items-center gap-4">
          <Donut data={data} />
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-white/60">Total Value</div>
            <div className="text-2xl font-bold">${total.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
        <div className="mb-4 text-sm uppercase tracking-widest text-white/60">Cash vs. Invested</div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${(invested / (total || 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          />
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span>Invested ${invested.toLocaleString()}</span>
          <span>Cash ${cash.toLocaleString()}</span>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm uppercase tracking-widest text-white/60">Holdings</div>
          <ul className="space-y-2">
            {Object.values(positions).map((p) => (
              <li key={p.symbol} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-white/80">{p.name}</span>
                <span className="font-semibold">{p.shares} @ ${p.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
