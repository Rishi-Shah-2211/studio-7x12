"use client";

import { useEffect, useState } from "react";
import { STUDIO } from "@/lib/data";

/**
 * Sticky bottom CTA for mobile — appears after hero, hides at booking.
 * Two-tap: WhatsApp (primary) + Call.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      // Show after 0.6 screens, hide near the bottom (footer area)
      const docH = document.documentElement.scrollHeight;
      const nearBottom = y + h > docH - h * 1.2;
      setVisible(y > h * 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="px-4 pb-4 pt-3 bg-gradient-to-t from-ink via-ink/95 to-transparent">
        <div className="pointer-events-auto flex items-stretch gap-2 rounded-full bg-ink-2 border border-bone/15 p-1 shadow-2xl">
          <a
            href={`https://wa.me/${STUDIO.phoneRaw}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-sage text-ink py-3 font-medium text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.93 11.93 0 0012.05 0C5.5 0 .2 5.3.2 11.85a11.8 11.8 0 001.6 5.92L0 24l6.4-1.68a11.83 11.83 0 005.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.24-6.15-3.39-8.43z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ember text-bone py-3 px-5 text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 00-1.02.24l-2.2 2.2a15.07 15.07 0 01-6.59-6.59l2.2-2.2a1 1 0 00.24-1.02A11.36 11.36 0 018.5 4a1 1 0 00-1-1H4a1 1 0 00-1 1 17 17 0 0017 17 1 1 0 001-1v-3.5a1 1 0 00-1-1z" />
            </svg>
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
