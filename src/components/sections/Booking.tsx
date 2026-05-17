"use client";

import { STUDIO, SERVICES } from "@/lib/data";
import { OpenNowDial } from "@/components/ui/OpenNowDial";
import { useState } from "react";

export function Booking() {
  const [service, setService] = useState(SERVICES[0].id);
  const selected = SERVICES.find((s) => s.id === service)!;
  const waText = encodeURIComponent(
    `Hi Studio 7x12 — I'd like to book "${selected.title}". When is your next slot?`
  );
  const waLink = `https://wa.me/${STUDIO.phoneRaw}?text=${waText}`;

  return (
    <section
      id="book"
      className="relative w-full bg-mist py-32 px-6 md:px-12 overflow-hidden"
    >
      {/* Bg glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, var(--ember), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
          06 / Book
        </span>
        <h2 className="font-display mt-4 text-5xl md:text-8xl leading-[0.9] text-bone text-balance">
          Reserve a chair.
          <br />
          <span className="text-ember">No app. No friction.</span>
        </h2>

        <div className="mt-16 grid md:grid-cols-2 gap-10">
          {/* Left: WhatsApp booking */}
          <div className="rounded-2xl border border-bone/10 bg-ink-2 p-8 md:p-10">
            <OpenNowDial />

            <div className="mt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted mb-3">
                What for?
              </div>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setService(s.id)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      service === s.id
                        ? "bg-ember text-bone"
                        : "border border-bone/15 text-bone-dim hover:border-bone/40 hover:text-bone"
                    }`}
                  >
                    {s.category}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-mist p-5">
                <div className="font-display text-2xl text-bone">{selected.title}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-bone-dim text-sm">
                  <span>₹{selected.priceFrom}–{selected.priceTo.toLocaleString()}</span>
                  <span>·</span>
                  <span>{selected.duration}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-sage px-7 py-4 text-ink font-medium hover:opacity-90 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.52 3.48A11.93 11.93 0 0012.05 0C5.5 0 .2 5.3.2 11.85a11.8 11.8 0 001.6 5.92L0 24l6.4-1.68a11.83 11.83 0 005.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.24-6.15-3.39-8.43zM12.05 21.6h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.8 1 1.01-3.7-.23-.38a9.78 9.78 0 01-1.5-5.2c0-5.42 4.42-9.83 9.85-9.83 2.63 0 5.1 1.03 6.96 2.88a9.77 9.77 0 012.88 6.96c0 5.42-4.42 9.83-9.8 9.83z" />
                  </svg>
                  WhatsApp us now
                </a>
                <a
                  href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center rounded-full border border-bone/20 px-6 py-4 text-bone hover:bg-bone hover:text-ink transition"
                >
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* Right: location card */}
          <div className="rounded-2xl border border-bone/10 bg-ink-2 p-8 md:p-10 flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted mb-3">
              Find us
            </div>
            <div className="font-display text-3xl md:text-4xl text-bone leading-tight">
              4th floor,
              <br />
              Krishna Aron
            </div>
            <p className="mt-4 text-bone-dim leading-relaxed">
              Opposite Sanket Sales India, behind Iris Hospital, 60 Feet Road,
              Anand, Gujarat 388001
            </p>

            <a
              href={STUDIO.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone border-b border-bone/30 pb-1 hover:text-ember hover:border-ember transition self-start"
            >
              Open in Maps →
            </a>

            <div className="mt-auto pt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted mb-2">
                  Call
                </div>
                <div className="font-display text-xl text-bone">{STUDIO.phone}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted mb-2">
                  Instagram
                </div>
                <a
                  href={STUDIO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-xl text-bone hover:text-ember transition"
                >
                  @studio7x12
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
