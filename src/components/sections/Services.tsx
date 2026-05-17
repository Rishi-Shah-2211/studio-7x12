"use client";

/**
 * Services
 * --------
 * The big scrolly moment. Section pins for N viewport-heights where N = service count.
 * As user scrolls, the 3D tool morphs and the copy on the left swaps with crossfade.
 * Each "step" highlights one service category.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/data";

const ToolMorph = dynamic(
  () => import("@/components/three/ToolMorph").then((m) => m.ToolMorph),
  { ssr: false }
);

export function Services() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: () => `+=${SERVICES.length * 100}%`,
        pin: trackRef.current,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const idx = Math.min(
            SERVICES.length - 1,
            Math.floor(p * SERVICES.length)
          );
          setActive(idx);
        },
      });
      return () => trigger.kill();
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const s = SERVICES[active];

  return (
    <section
      ref={wrapRef}
      id="services"
      className="relative w-full"
      style={{ height: `${(SERVICES.length + 1) * 100}vh` }}
    >
      <div
        ref={trackRef}
        className="relative h-screen w-full overflow-hidden bg-ink"
      >
        {/* Section label */}
        <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
            02 / Services
          </span>
          <span className="h-px w-12 bg-copper/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-muted">
            {String(active + 1).padStart(2, "0")} of{" "}
            {String(SERVICES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Progress dots on right */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {SERVICES.map((srv, i) => (
            <div key={srv.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  i === active ? "text-bone" : "text-bone-muted"
                }`}
              >
                {srv.category}
              </span>
              <span
                className={`block h-px transition-all ${
                  i === active
                    ? "w-10 bg-ember"
                    : "w-4 bg-bone-muted/40"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Grid layout */}
        <div className="relative grid h-full grid-cols-12 px-6 md:px-12">
          {/* Left: copy */}
          <div className="col-span-12 md:col-span-5 self-center pt-24 md:pt-0">
            <div key={s.id} className="animate-[fadeUp_.6s_ease-out]">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                {s.category}
                {s.hindi ? ` · ${s.hindi}` : ""}
              </span>
              <h3 className="font-display mt-4 text-5xl md:text-7xl leading-[0.95] text-bone text-balance">
                {s.title}
              </h3>
              <p className="mt-6 max-w-md text-bone-dim text-lg leading-relaxed">
                {s.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-8">
                <Stat label="Price range" value={`₹${s.priceFrom}–${s.priceTo.toLocaleString()}`} />
                <Stat label="Duration" value={s.duration} />
              </div>

              <a
                href="#book"
                className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone border-b border-bone/30 pb-1 hover:text-ember hover:border-ember transition"
              >
                Book this →
              </a>
            </div>
          </div>

          {/* Right: 3D tool */}
          <div className="col-span-12 md:col-span-7 relative">
            <div className="absolute inset-0">
              <ToolMorph
                tool={s.tool}
                progress={progress}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted mb-2">
        {label}
      </div>
      <div className="font-display text-2xl text-bone">{value}</div>
    </div>
  );
}
