import React from 'react';

const tabs = [
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'trade', label: 'Trade' },
];

export default function Tabs({ value, onChange }) {
  return (
    <div className="inline-flex bg-slate-800/60 border border-white/10 rounded-full p-1">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={
              `px-4 py-1.5 text-sm rounded-full transition-colors ` +
              (active
                ? 'bg-white text-slate-900 shadow'
                : 'text-slate-300 hover:text-white')
            }
            type="button"
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
