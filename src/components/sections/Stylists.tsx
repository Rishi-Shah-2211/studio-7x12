"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STYLISTS } from "@/lib/data";

export function Stylists() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stylist-card",
        { y: 80, opacity: 0, rotateZ: -3 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="team"
      className="relative w-full bg-mist py-32 md:py-44 px-6 md:px-12 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
              04 / The crew
            </span>
            <h2 className="font-display mt-4 text-5xl md:text-7xl leading-[0.95] text-bone text-balance">
              Thirteen hands. <br />
              One <em className="not-italic text-ember">obsession.</em>
            </h2>
          </div>
          <p className="max-w-sm text-bone-dim">
            Hover any card to flip. Every stylist has trained outside Anand —
            Mumbai, Bangkok, Bangalore. We bring the world's craft home.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {STYLISTS.map((p, i) => (
            <StylistCard key={p.name} person={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StylistCard({
  person,
  index,
}: {
  person: (typeof STYLISTS)[number];
  index: number;
}) {
  const hue = (index * 53) % 60;
  return (
    <div className="stylist-card group [perspective:1000px]">
      <div className="relative aspect-[3/4] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] border border-bone/10"
          style={{
            background: `linear-gradient(${135 + index * 15}deg, hsl(${20 + hue}, 22%, 12%), hsl(${30 + hue}, 35%, 22%))`,
          }}
        >
          <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-muted">
            {String(index + 1).padStart(2, "0")} / 13
          </div>
          <div className="absolute top-3 right-3 text-bone/70">{person.sign}</div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="font-display text-2xl text-bone">{person.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mt-1">
              {person.role}
            </div>
          </div>
          {/* Decorative arc */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 opacity-20"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--copper)"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />
          </svg>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-xl bg-ember p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70">
              specialty
            </div>
            <div className="font-display text-xl text-bone mt-2 leading-tight">
              {person.specialty}
            </div>
          </div>
          <div>
            <div className="font-display text-5xl text-bone">{person.years}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 mt-1">
              years in the chair
            </div>
            <a
              href="#book"
              className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-bone border-b border-bone/40 pb-0.5"
            >
              Book with {person.name.split(" ")[0]} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
