import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import Hero3D from './components/Hero3D';
import Tabs from './components/Tabs';
import PortfolioView from './components/PortfolioView';
import TradePanel from './components/TradePanel';

function Header({ onLoginToggle, loggedIn }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-900/30" />
        <div>
          <div className="font-semibold text-white">VibeStocks</div>
          <div className="text-xs text-white/60">Built for traders</div>
        </div>
      </div>
      <button
        onClick={onLoginToggle}
        className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/15"
      >
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('portfolio');
  const [loggedIn, setLoggedIn] = useState(true);
  const [cash, setCash] = useState(2500);
  const [positions, setPositions] = useState({
    'Richtech Robotics': { quantity: 0, avgPrice: 10 },
    'SES AI': { quantity: 0, avgPrice: 5 },
    'BlackBerry': { quantity: 0, avgPrice: 4 },
  });

  const totalValue = useMemo(() => {
    const invested = Object.values(positions).reduce((s, p) => s + p.quantity * p.avgPrice, 0);
    return invested + cash;
  }, [positions, cash]);

  const onCashChange = (delta) => setCash((c) => Math.max(0, c + delta));

  const onTrade = ({ name, side, quantity, price }) => {
    setPositions((prev) => {
      const cur = prev[name] || { quantity: 0, avgPrice: price };
      let qty = cur.quantity;
      let avg = cur.avgPrice;

      if (side === 'BUY') {
        const cost = qty * avg + quantity * price;
        qty += quantity;
        avg = qty > 0 ? cost / qty : price;
        setCash((c) => Math.max(0, c - quantity * price));
      } else {
        qty = Math.max(0, qty - quantity);
        setCash((c) => c + quantity * price);
      }

      return { ...prev, [name]: { quantity: qty, avgPrice: avg } };
    });
  };

  // Mouse-follow ambient highlight
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.7 });
  const onRootMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(Math.max(0, Math.min(1, x)));
    my.set(Math.max(0, Math.min(1, y)));
  };

  return (
    <div onMouseMove={onRootMove} className="min-h-screen bg-[#070512] pb-16">
      {/* Ambient cursor-follow highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            sx.to((vx) => sy.to((vy) => `radial-gradient(600px circle at ${vx * 100}% ${vy * 100}%, rgba(99,102,241,0.12), transparent 40%)`)),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Header onLoginToggle={() => setLoggedIn((v) => !v)} loggedIn={loggedIn} />
        <Hero3D />

        <div className="mt-6 flex items-center justify-between">
          <Tabs
            tabs={[
              { label: 'Portfolio', value: 'portfolio' },
              { label: 'Stocks', value: 'stocks' },
            ]}
            active={active}
            onChange={setActive}
          />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
          >
            Total value: ${totalValue.toLocaleString()}
          </motion.div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {active === 'portfolio' ? (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <PortfolioView positions={positions} cash={cash} />
              </motion.div>
            ) : (
              <motion.div key="stocks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <TradePanel onCashChange={onCashChange} onTrade={onTrade} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
