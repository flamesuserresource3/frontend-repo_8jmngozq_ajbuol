import React, { useEffect, useMemo, useState, Suspense } from 'react';

// Lazy import Spline only on client to avoid any potential SSR/hydration quirks
const LazySpline = React.lazy(() => import('@splinetool/react-spline'));

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [enable3D, setEnable3D] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If anything goes wrong with Spline loading, fall back gracefully
  const onError = () => setEnable3D(false);

  return (
    <section className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* 3D Scene (lazy + guarded). If it fails, we keep the nice gradient section. */}
      {mounted && enable3D ? (
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full" />}>
            <LazySpline
              scene="https://prod.spline.design/8VqJq-0f7F5bC1uX/scene.splinecode"
              onError={onError}
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </div>
      ) : (
        <div className="absolute inset-0" />
      )}

      {/* Soft gradient glows that don't block pointer events */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Overlay copy */}
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
