"use client";

import { useEffect, useState } from "react";
import { STUDIO } from "@/lib/data";

/** Parses "HH:MM" into minutes since midnight */
const toMinutes = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

export function OpenNowDial() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const open = toMinutes(STUDIO.hours.open);
  const close = toMinutes(STUDIO.hours.close);
  const cur = now.getHours() * 60 + now.getMinutes();
  const isOpen = cur >= open && cur < close;

  // dial: open = 0deg, close = 360deg
  const span = close - open;
  const progress = isOpen ? (cur - open) / span : 0;
  const angle = progress * 360 - 90;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--mist-2)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--ember)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 276.4} 276.4`}
          />
        </svg>
        {/* Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-12 h-0.5 origin-left bg-bone rounded-full"
          style={{
            transform: `translateY(-50%) rotate(${angle}deg)`,
          }}
        />
        <span className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isOpen ? "bg-sage animate-pulse" : "bg-bone-muted"}`}
          />
          <span className="font-display text-2xl text-bone">
            {isOpen ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-muted mt-1">
          {STUDIO.hours.label}
        </div>
      </div>
    </div>
  );
}
