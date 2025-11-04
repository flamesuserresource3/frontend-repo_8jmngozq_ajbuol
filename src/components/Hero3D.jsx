import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Hero3D() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.6 });

  const tiltX = useTransform(sy, [0, 1], [8, -8]);
  const tiltY = useTransform(sx, [0, 1], [-8, 8]);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(Math.max(0, Math.min(1, x)));
    my.set(Math.max(0, Math.min(1, y)));
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative h-[44vh] md:h-[60vh] w-full overflow-hidden rounded-3xl bg-[radial-gradient(125%_125%_at_50%_10%,#0b0b1a_40%,#111131_60%,#1a1240_100%)]"
      aria-label="Interactive 3D hero"
    >
      <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0b001a66] to-[#070512]" />

      <motion.div
        className="pointer-events-none absolute h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: sx.to((v) => `${v * 100}%`),
          top: sy.to((v) => `${v * 100}%`),
          background:
            'radial-gradient(closest-side, rgba(124,58,237,0.35), rgba(6,182,212,0.15), transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 md:p-10">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="text-2xl md:text-4xl font-semibold tracking-tight text-white/95"
          >
            Trade-ready portfolio tracking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 26 }}
            className="mt-2 text-sm md:text-base text-white/70"
          >
            Buy, sell and manage cash. Allocations and balances update instantly with fluid animations.
          </motion.p>
        </div>
      </div>

      {/* Floating stat chips with subtle parallax */}
      <motion.div
        className="pointer-events-none absolute right-6 top-6 hidden gap-3 md:flex"
        style={{ translateX: sx.to((v) => (v - 0.5) * 10), translateY: sy.to((v) => (v - 0.5) * 10) }}
      >
        {[
          { label: 'Speed', value: 'Ultra Smooth' },
          { label: 'Style', value: '3D + Neon' },
          { label: 'Focus', value: 'Traders' },
        ].map((chip) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur"
          >
            <span className="text-white/60">{chip.label}: </span>
            <span className="text-white">{chip.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
