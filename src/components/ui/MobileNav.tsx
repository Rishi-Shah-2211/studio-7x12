"use client";

import { useState, useEffect } from "react";
import { STUDIO } from "@/lib/data";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#signature", label: "The 7×12" },
  { href: "#team", label: "Team" },
  { href: "#book", label: "Book" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-bone/20 text-bone"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 w-[85%] max-w-sm bg-mist border-l border-bone/10 flex flex-col transition-transform duration-500 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-bone/10">
            <span className="font-display text-2xl text-bone">
              Studio<span className="text-ember">·</span>7
              <span className="text-bone-muted text-base align-top">×</span>12
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-bone/20 text-bone"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-5 border-b border-bone/10 font-display text-3xl text-bone hover:text-ember transition"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-muted mr-3">
                  0{i + 1}
                </span>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="p-6 border-t border-bone/10 space-y-3">
            <a
              href={`https://wa.me/${STUDIO.phoneRaw}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="block text-center rounded-full bg-sage text-ink py-4 font-medium"
            >
              WhatsApp us
            </a>
            <a
              href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
              onClick={() => setOpen(false)}
              className="block text-center rounded-full border border-bone/20 text-bone py-4"
            >
              Call {STUDIO.phone}
            </a>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone-muted pt-2">
              {STUDIO.hours.label}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
