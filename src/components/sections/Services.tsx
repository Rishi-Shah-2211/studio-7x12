"use client";

/**
 * Services — pinned scrollytelling on both desktop and mobile.
 * 3D tool morphs as user scrolls through service categories.
 * On mobile: 3D sits above text instead of beside it, but pin behaviour is kept.
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
        className="relative h-[100svh] w-full overflow-hidden bg-ink"
      >
        {/* Section label */}
        <div className="absolute top-6 md:top-8 left-5 md:left-12 z-20 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
            02 / Services
          </span>
          <span className="hidden md:inline-block h-px w-12 bg-copper/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-muted">
            {String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Progress rail — bottom on mobile, right on desktop */}
        <div className="md:hidden absolute bottom-4 inset-x-5 z-20 flex gap-1.5">
          {SERVICES.map((srv, i) => (
            <span
              key={srv.id}
              className={`h-0.5 flex-1 rounded-full transition-all ${
                i === active ? "bg-ember" : "bg-bone-muted/30"
              }`}
            />
          ))}
        </div>
        <div className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
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
                  i === active ? "w-10 bg-ember" : "w-4 bg-bone-muted/40"
                }`}
              />
            </div>
          ))}
        </div>

        {/* ===== MOBILE: 3D top, copy bottom ===== */}
        <div className="md:hidden flex flex-col h-full pt-16 pb-12 px-5">
          <div className="relative flex-1 min-h-0 -mx-5">
            <ToolMorph tool={s.tool} progress={progress} className="w-full h-full" />
          </div>
          <div key={s.id} className="animate-[fadeUp_.5s_ease-out] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
              {s.category}{s.hindi ? ` · ${s.hindi}` : ""}
            </span>
            <h3 className="font-display mt-2 text-4xl leading-[0.95] text-bone text-balance">
              {s.title}
            </h3>
            <p className="mt-3 text-bone-dim text-sm leading-relaxed line-clamp-3">
              {s.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-bone-muted">price</div>
                  <div className="font-display text-base text-bone">₹{s.priceFrom}–{s.priceTo.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-bone-muted">time</div>
                  <div className="font-display text-base text-bone">{s.duration}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP: side-by-side ===== */}
        <div className="hidden md:grid relative h-full grid-cols-12 px-12">
          <div className="col-span-5 self-center">
            <div key={s.id} className="animate-[fadeUp_.6s_ease-out]">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                {s.category}{s.hindi ? ` · ${s.hindi}` : ""}
              </span>
              <h3 className="font-display mt-4 text-7xl leading-[0.95] text-bone text-balance">
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
          <div className="col-span-7 relative">
            <div className="absolute inset-0">
              <ToolMorph tool={s.tool} progress={progress} className="w-full h-full" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
