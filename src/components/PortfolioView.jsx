import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function toColors(i) {
  const palette = [
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#22c55e', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#0ea5e9', // sky-500
    '#a855f7', // purple-500
  ];
  return palette[i % palette.length];
}

function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 200 200" className="h-48 w-48">
      <circle cx="100" cy="100" r={radius} stroke="#1f2337" strokeWidth="26" fill="none" />
      {data.map((d, i) => {
        const fraction = d.value / total;
        const dash = fraction * circumference;
        const gap = circumference - dash;
        const dashArray = `${dash} ${gap}`;
        const rotation = (acc / total) * 360 - 90;
        acc += d.value;
        return (
          <circle
            key={d.name}
            cx="100"
            cy="100"
            r={radius}
            stroke={toColors(i)}
            strokeWidth="26"
            strokeDasharray={dashArray}
            strokeLinecap="butt"
            fill="none"
            transform={`rotate(${rotation} 100 100)`}
          />
        );
      })}
      <circle cx="100" cy="100" r="52" fill="#0a0c17" />
      <text x="100" y="100" textAnchor="middle" dominantBaseline="central" className="fill-white/80 text-sm">
        {Math.round((data.reduce((s, d) => s + d.value, 0) / total) * 100)}%
      </text>
    </svg>
  );
}

function Legend({ data }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: toColors(i) }} />
            <span className="text-white/80">{d.name}</span>
          </div>
          <span className="text-white/60">{d.pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

function CashVsInvested({ cash, invested }) {
  const total = Math.max(1, cash + invested);
  const cashPct = (cash / total) * 100;
  const invPct = (invested / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between text-sm">
        <span className="text-white/70">Cash vs. Invested</span>
        <span className="text-white/90">${(cash + invested).toLocaleString()}</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
        <div className="absolute left-0 top-0 h-full bg-cyan-500/80" style={{ width: `${cashPct}%` }} />
        <div className="absolute left-0 top-0 h-full bg-violet-500/80" style={{ width: `${cashPct + invPct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/60">
        <span>Cash {cashPct.toFixed(1)}%</span>
        <span>Invested {invPct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function PortfolioView({ positions, cash }) {
  const { allocData, invested } = useMemo(() => {
    const entries = Object.entries(positions);
    const values = entries.map(([name, p]) => ({ name, value: p.quantity * p.avgPrice }));
    const investedSum = values.reduce((s, v) => s + v.value, 0);
    const alloc = values
      .filter((v) => v.value > 0)
      .map((v) => ({ ...v, pct: investedSum ? (v.value / investedSum) * 100 : 0 }));
    return { allocData: alloc, invested: investedSum };
  }, [positions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121329] to-[#0a0c17] p-6 shadow-xl shadow-violet-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-white/90">Portfolio Allocation</h3>
          <span className="text-sm text-white/60">Live % by value</span>
        </div>
        <div className="flex items-center gap-6">
          <Donut data={allocData} />
          <Legend data={allocData} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121329] to-[#0a0c17] p-6 shadow-xl shadow-cyan-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-white/90">Balances</h3>
          <span className="text-sm text-white/60">Instantly updates</span>
        </div>
        <CashVsInvested cash={cash} invested={invested} />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/80">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-white/60">Cash</div>
            <div className="text-lg">${cash.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-white/60">Invested</div>
            <div className="text-lg">${invested.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
