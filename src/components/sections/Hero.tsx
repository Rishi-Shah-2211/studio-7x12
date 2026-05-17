"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { STUDIO } from "@/lib/data";
import { MobileNav } from "@/components/ui/MobileNav";

const ToolMorph = dynamic(
  () => import("@/components/three/ToolMorph").then((m) => m.ToolMorph),
  { ssr: false }
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = window.innerHeight - rect.top;
      progressRef.current = Math.max(0, Math.min(1, seen / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink"
      id="hero"
    >
      {/* Background ember glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, rgba(194,65,12,0.25), transparent 60%), radial-gradient(40% 40% at 20% 80%, rgba(184,115,51,0.18), transparent 60%)",
        }}
      />

      {/* Top nav */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 md:px-12 pt-5 md:pt-6">
        <a href="#hero" className="font-display text-2xl md:text-3xl text-bone">
          Studio<span className="text-ember">·</span>7
          <span className="text-bone-muted text-base align-top">×</span>12
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.18em] text-bone-dim">
          <a href="#services" className="hover:text-bone">Services</a>
          <a href="#signature" className="hover:text-bone">7×12</a>
          <a href="#team" className="hover:text-bone">Team</a>
          <a href="#book" className="hover:text-bone">Book</a>
        </nav>
        <a
          href={`https://wa.me/${STUDIO.phoneRaw}`}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-bone/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-bone hover:bg-bone hover:text-ink transition"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
          WhatsApp
        </a>
        <MobileNav />
      </div>

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="md:hidden relative z-10 flex flex-col h-[100svh] pt-24 pb-20 px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper mb-4">
          Anand · est. 2018
        </p>
        <h1 className="font-display text-[13vw] leading-[0.88] text-bone text-balance">
          Where craft
          <br />
          meets <em className="not-italic text-ember">calm.</em>
        </h1>

        {/* 3D tool fills remaining space, scaled down */}
        <div className="relative flex-1 min-h-0 -mx-5 my-4">
          <ToolMorph tool="scissor" progressRef={progressRef} className="w-full h-full" />
        </div>

        <p className="text-bone-dim text-sm leading-relaxed mb-4">
          Anand's largest unisex salon & spa. 13 stylists, six rooms, one
          quiet promise.
        </p>

        <div className="flex items-center gap-3">
          <a
            href="#book"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-5 py-3.5 text-bone text-sm font-medium"
          >
            Reserve a chair →
          </a>
          <a
            href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-bone/20 text-bone"
            aria-label="Call"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 00-1.02.24l-2.2 2.2a15.07 15.07 0 01-6.59-6.59l2.2-2.2a1 1 0 00.24-1.02A11.36 11.36 0 018.5 4a1 1 0 00-1-1H4a1 1 0 00-1 1 17 17 0 0017 17 1 1 0 001-1v-3.5a1 1 0 00-1-1z" />
            </svg>
          </a>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden md:grid relative z-10 h-[100svh] grid-cols-12 grid-rows-12 px-12">
        <div className="col-span-5 row-start-3 row-span-6 self-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper mb-6">
            Anand · est. 2018 · 4th floor, 60 Feet Road
          </p>
          <h1 className="font-display text-[7.5vw] leading-[0.85] text-bone text-balance">
            Where craft
            <br />
            meets <em className="not-italic text-ember">calm.</em>
          </h1>
          <p className="mt-8 max-w-md text-bone-dim text-lg leading-relaxed">
            Anand's largest unisex salon & spa. 13 stylists. Six service rooms.
            One quiet promise — you leave looking like the best version of you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              className="group inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 text-bone hover:bg-ember-deep transition"
            >
              Reserve a chair
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
              className="text-sm text-bone-dim hover:text-bone"
            >
              or call {STUDIO.phone}
            </a>
          </div>
        </div>

        <div className="col-span-7 row-start-1 row-span-12 relative">
          <div className="absolute inset-0">
            <ToolMorph tool="scissor" progressRef={progressRef} className="w-full h-full" />
          </div>
          <Callout className="top-[18%] right-[8%]" label="13 stylists" sub="trained in Mumbai & Bangkok" />
          <Callout className="bottom-[24%] right-[14%]" label="4.5 ★" sub="90+ Google reviews" />
          <Callout className="bottom-[12%] left-[6%]" label="open now" sub="8 AM — 9:30 PM, daily" dot />
        </div>
      </div>

      {/* Scroll cue — desktop only */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-muted">
          scroll · the scissor turns
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-copper to-transparent" />
      </div>
    </section>
  );
}

function Callout({
  className = "",
  label,
  sub,
  dot,
}: {
  className?: string;
  label: string;
  sub: string;
  dot?: boolean;
}) {
  return (
    <div
      className={`absolute hidden md:flex flex-col gap-1 rounded-xl border border-bone/10 bg-ink-2/70 backdrop-blur-md px-4 py-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-bone text-sm">
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />}
        {label}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-muted">
        {sub}
      </div>
    </div>
  );
}
