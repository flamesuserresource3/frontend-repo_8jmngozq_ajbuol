import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {mounted && show3D ? (
        <div className="absolute inset-0">
          <Spline
            scene="https://prod.spline.design/8VqJq-0f7F5bC1uX/scene.splinecode"
            onError={() => setShow3D(false)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div className="absolute inset-0" />
      )}

      {/* Soft gradient glows that don't block pointer events */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-end p-6 sm:p-8 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight">
            Trade smarter with a live, responsive dashboard
          </h1>
          <p className="text-slate-300/80 mt-2 max-w-xl text-sm sm:text-base">
            Real-time insights, fluid interactions, and a clean, focused workflow.
          </p>
        </div>
      </div>
    </section>
  );
}
