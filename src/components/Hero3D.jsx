import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';

// Simple 3D hero with mouse tilt and parallax chips
export default function Hero3D() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [12, -12]);
  const rotateY = useTransform(x, [-200, 200], [-12, 12]);

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx);
    y.set(dy);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      style={{ perspective: 1200 }}
      className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-[#0b1020] to-black"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="h-full w-full"
      >
        <div className="absolute inset-0">
          <Spline
            scene="https://prod.spline.design/8r7y2cP1m1Z8oI0e/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Parallax stat chips */}
        <motion.div
          style={{ x: useTransform(x, v => v * 0.05), y: useTransform(y, v => v * 0.05) }}
          className="absolute left-6 top-6 select-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur"
        >
          Daily P/L +2.4%
        </motion.div>
        <motion.div
          style={{ x: useTransform(x, v => v * -0.06), y: useTransform(y, v => v * -0.04) }}
          className="absolute right-6 bottom-6 select-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur"
        >
          Volatility Low
        </motion.div>
      </motion.div>

      {/* Glow and gradient veils (non-blocking) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-20 bg-gradient-to-tr from-fuchsia-600/20 via-teal-400/10 to-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.3))]" />
      </div>
    </motion.div>
  );
}
