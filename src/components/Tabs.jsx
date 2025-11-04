import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
      {tabs.map((t) => {
        const selected = t.value === active;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected ? 'text-white' : 'text-white/70 hover:text-white/90'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/80 to-cyan-500/80 shadow-[0_8px_24px_rgba(124,58,237,0.35)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
