"use client";

/**
 * SignatureGrid — the "7×12 = 84" emotional moment.
 * 7 columns × 12 rows. Tiles reveal on scroll with a stagger.
 * Hover expands a tile and gently pushes neighbours via scale on a CSS grid.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TILES } from "@/lib/data";

export function SignatureGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tiles = gridRef.current?.querySelectorAll(".tile") ?? [];
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.6, filter: "blur(6px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          stagger: {
            grid: [12, 7],
            from: "center",
            amount: 1.2,
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );

      // Headline reveal
      gsap.fromTo(
        ".sig-headline > *",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="signature"
      className="relative w-full bg-ink py-24 md:py-44 px-5 md:px-12 overflow-hidden"
    >
      {/* Section eyebrow */}
      <div className="mx-auto max-w-7xl">
        <div className="sig-headline">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
            03 / The signature
          </span>
          <h2 className="font-display mt-4 md:mt-6 text-5xl md:text-9xl leading-[0.9] text-bone text-balance">
            Seven by twelve.
            <br />
            <span className="text-ember">Eighty-four</span> ways to
            <br />
            walk out new.
          </h2>
          <p className="mt-6 md:mt-8 max-w-xl text-bone-dim text-base md:text-lg leading-relaxed">
            Our name isn't an accident. Seven days a week, twelve hours a day —
            eighty-four chances to change the way you feel. Hover any tile.
          </p>
        </div>

        {/* The grid */}
        <div
          ref={gridRef}
          className="mt-12 md:mt-20 grid gap-1.5 md:gap-3"
          style={{
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gridAutoRows: "minmax(44px, 8vw)",
          }}
        >
          {TILES.map((t) => (
            <Tile key={t.id} tile={t} />
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone-muted">
          7 × 12 = 84 tiles · each will hold a real moment from our floor
        </p>
      </div>

      {/* Ember pulse bg */}
      <div
        className="pointer-events-none absolute top-1/3 -right-32 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, var(--ember), transparent 70%)" }}
      />
    </section>
  );
}

function Tile({ tile }: { tile: (typeof TILES)[number] }) {
  const colSpan = tile.span?.col ?? 1;
  const rowSpan = tile.span?.row ?? 1;

  if (tile.kind === "text" || tile.kind === "stat") {
    return (
      <div
        className={`tile group relative flex flex-col items-center justify-center rounded-md p-3 transition duration-500 hover:scale-[1.06] hover:z-10 ${
          tile.emphasis
            ? "bg-ember text-bone"
            : "bg-mist-2 text-bone border border-bone/5"
        }`}
        style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
      >
        <div
          className={`font-display leading-none ${
            tile.emphasis ? "text-2xl md:text-4xl" : "text-xl md:text-3xl"
          }`}
        >
          {tile.text}
        </div>
        {tile.sub && (
          <div className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] mt-1 opacity-70">
            {tile.sub}
          </div>
        )}
      </div>
    );
  }

  if (tile.kind === "blank") {
    return (
      <div
        className="tile rounded-md border border-copper/20 bg-gradient-to-br from-mist-2 to-mist transition duration-500 hover:scale-[1.06]"
        style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
      />
    );
  }

  // photo placeholder — gradient with subtle pattern
  const hue = (tile.id * 47) % 60; // 0..60 range — warm
  return (
    <div
      className="tile group relative overflow-hidden rounded-md cursor-pointer transition duration-500 hover:scale-[1.08] hover:z-10"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        background: `linear-gradient(${135 + tile.id * 4}deg, hsl(${20 + hue}, ${20 + (tile.id % 30)}%, ${10 + (tile.id % 15)}%), hsl(${30 + hue}, 40%, ${18 + (tile.id % 12)}%))`,
      }}
    >
      <span className="absolute inset-0 ring-1 ring-inset ring-bone/5 rounded-md" />
      <span className="absolute bottom-1 left-1.5 font-mono text-[8px] text-bone/30 opacity-0 group-hover:opacity-100 transition">
        {String(tile.id).padStart(2, "0")}
      </span>
    </div>
  );
}
