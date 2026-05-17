"use client";

import { SERVICES } from "@/lib/data";

export function Marquee() {
  const items = [
    "Hair · Beard · Skin · Nails · Bridal · Spa",
    "Anand · 60 Feet Road",
    "Open 8 AM — 9:30 PM",
    "Walk-ins welcome",
    ...SERVICES.map((s) => s.hindi).filter(Boolean),
  ];
  const loop = [...items, ...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-mist py-5">
      <div className="marquee-track flex gap-12 whitespace-nowrap font-display text-2xl md:text-3xl text-bone-dim">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <span className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
