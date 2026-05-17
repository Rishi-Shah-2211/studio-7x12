import { STUDIO } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative w-full bg-ink border-t border-bone/10 px-6 md:px-12 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <a href="#hero" className="font-display text-4xl text-bone">
              Studio<span className="text-ember">·</span>7
              <span className="text-bone-muted text-2xl align-top">×</span>12
            </a>
            <p className="mt-4 text-bone-dim max-w-xs">
              Where craft meets calm. Anand's flagship unisex salon & spa,
              since 2018.
            </p>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-muted space-y-3">
            <div>
              <div className="text-bone-muted">Visit</div>
              <div className="text-bone normal-case tracking-normal text-sm mt-1">
                {STUDIO.shortAddress}
              </div>
            </div>
            <div>
              <div className="text-bone-muted">Hours</div>
              <div className="text-bone normal-case tracking-normal text-sm mt-1">
                {STUDIO.hours.label}
              </div>
            </div>
            <div>
              <div className="text-bone-muted">Call</div>
              <div className="text-bone normal-case tracking-normal text-sm mt-1">
                {STUDIO.phone}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-bone-dim hover:text-ember transition"
            >
              Instagram → @studio7x12
            </a>
            <a
              href={STUDIO.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-bone-dim hover:text-ember transition"
            >
              Facebook →
            </a>
            <a
              href={`https://wa.me/${STUDIO.phoneRaw}`}
              target="_blank"
              rel="noreferrer"
              className="text-bone-dim hover:text-ember transition"
            >
              WhatsApp →
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="font-display text-[14vw] md:text-[12vw] leading-none text-bone/5 select-none">
            7×12
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bone/10 flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-muted">
          <span>© 2026 Studio 7x12 — All chairs reserved.</span>
          <span>Designed with care · Anand, GJ</span>
        </div>
      </div>
    </footer>
  );
}
