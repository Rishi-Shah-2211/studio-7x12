"use client";

import { TESTIMONIALS, STUDIO } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="relative w-full bg-ink py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
              05 / Word of mouth
            </span>
            <h2 className="font-display mt-4 text-4xl md:text-6xl text-bone text-balance">
              {STUDIO.rating}★ on Google · {STUDIO.reviewCount}+ reviews
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="relative rounded-2xl border border-bone/10 bg-mist p-7 hover:border-ember/40 transition"
            >
              <div className="text-ember text-4xl font-display leading-none">"</div>
              <blockquote className="text-bone-dim text-lg leading-relaxed mt-2">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="text-bone">{t.author}</span>
                <span className="text-bone-muted">{t.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
