import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Hero3D() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.6 });

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
      className="relative h-[42vh] md:h-[56vh] w-full overflow-hidden rounded-3xl bg-[radial-gradient(125%_125%_at_50%_10%,#0b0b1a_40%,#111131_60%,#1a1240_100%)]"
      aria-label="Interactive 3D hero"
    >
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient veil that doesn't block interactions */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0b001a44] to-[#070512]" />

      {/* Mouse-follow soft glow */}
      <motion.div
        className="pointer-events-none absolute h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: sx.to((v) => `${v * 100}%`),
          top: sy.to((v) => `${v * 100}%`),
          background:
            'radial-gradient(closest-side, rgba(122,106,255,0.35), rgba(106,219,255,0.15), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Title */}
      <div className="relative z-10 flex h-full w-full items-end p-6 md:p-10">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-white/95">
            Fluid stock tracking with 3D vibes
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Buy, sell, add cash, and see live allocations with playful animations.
          </p>
        </div>
      </div>
    </section>
  );
}
