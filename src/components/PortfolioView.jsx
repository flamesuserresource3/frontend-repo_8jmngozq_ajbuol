import React, { useMemo } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

function toColors(i) {
  const palette = ['#8b5cf6','#06b6d4','#22c55e','#f59e0b','#ef4444','#ec4899','#0ea5e9','#a855f7'];
  return palette[i % palette.length];
}

function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 200 200" className="h-52 w-52">
      <circle cx="100" cy="100" r={radius} stroke="#1f2337" strokeWidth="26" fill="none" />
      {data.map((d, i) => {
        const fraction = d.value / total;
        const dash = fraction * circumference;
        const gap = circumference - dash;
        const rotation = (acc / total) * 360 - 90;
        acc += d.value;
        return (
          <motion.circle
            key={d.name}
            cx="100"
            cy="100"
            r={radius}
            stroke={toColors(i)}
            strokeWidth="26"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="butt"
            fill="none"
            transform={`rotate(${rotation} 100 100)`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
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

function Legend({ data, onHover }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {data.map((d, i) => (
        <div
          key={d.name}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          className="flex cursor-default items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-white/5"
        >
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
  const mv = useMotionValue(cashPct);
  const sv = useSpring(mv, { stiffness: 220, damping: 26, mass: 0.8 });
  mv.set(cashPct);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between text-sm">
        <span className="text-white/70">Cash vs. Invested</span>
        <span className="text-white/90">${(cash + invested).toLocaleString()}</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div className="absolute left-0 top-0 h-full bg-cyan-500/80" style={{ width: sv.to((v) => `${v}%`) }} />
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
  const [hoverIndex, setHoverIndex] = React.useState(null);
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
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121329] to-[#0a0c17] p-6 shadow-xl shadow-violet-900/25"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-white/90">Portfolio Allocation</h3>
          <span className="text-sm text-white/60">Live % by value</span>
        </div>
        <div className="flex items-center gap-6">
          <Donut data={allocData} />
          <Legend data={allocData} onHover={setHoverIndex} />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121329] to-[#0a0c17] p-6 shadow-xl shadow-cyan-900/25"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-white/90">Balances</h3>
          <span className="text-sm text-white/60">Instantly updates</span>
        </div>
        <CashVsInvested cash={cash} invested={invested} />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/80">
          <motion.div layout className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-white/60">Cash</div>
            <div className="text-lg">${cash.toLocaleString()}</div>
          </motion.div>
          <motion.div layout className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-white/60">Invested</div>
            <div className="text-lg">${invested.toLocaleString()}</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
