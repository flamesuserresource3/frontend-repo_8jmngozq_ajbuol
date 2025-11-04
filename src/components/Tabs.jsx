import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ value, onChange, tabs }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-white backdrop-blur">
      {tabs.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`relative rounded-full px-4 py-2 transition-colors ${active ? 'text-slate-900' : 'text-white/80 hover:text-white'}`}
          >
            {active && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
