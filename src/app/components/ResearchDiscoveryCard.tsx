import { useState } from 'react';
import { BadgeCheck, ArrowRight, CalendarClock, Coins, Users2, ChevronDown } from 'lucide-react';
import { FEED_CARD, cn } from './Primitives';

export function ResearchDiscoveryCard({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  const facts = [
    { icon: Coins, k: 'Grant', v: 'up to ৳ 45 lakh' },
    { icon: CalendarClock, k: 'Deadline', v: '31 Jan 2026' },
    { icon: Users2, k: 'Teams', v: 'BD + 1 intl. partner' },
  ];
  return (
    <article className={cn(FEED_CARD, 'relative overflow-hidden')}>
      <div className="paper-grain absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-dashed border-pine-900/30 px-4 py-2 sm:px-5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-pine-600">Institutional · Research Discovery</span>
          <span className="flex items-center gap-1 rounded-full bg-pine-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-pine-700"><BadgeCheck className="size-3" />Verified</span>
        </div>
        <div className="px-4 pb-4 pt-4 sm:px-5">
          <div className="flex items-start gap-3.5">
            <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg border border-pine-900 bg-pine-900 text-canvas shadow-tactile-sm">
              <span className="font-display text-[17px] font-bold leading-none">IRCB</span>
              <span className="mt-0.5 font-mono text-[7.5px] tracking-widest opacity-70">EST. 2019</span>
            </span>
            <div>
              <h3 className="font-display text-[21px] font-semibold leading-tight text-pine-950">International Research Collaboration Bangladesh</h3>
              <p className="mt-1.5 font-bangla text-[14.5px] leading-relaxed text-pine-900/75">
                ২০২৬ রাউন্ডের উন্মুক্ত আহ্বান: জলবায়ু-সহনশীল ফসল, উপকূলীয় মাটির স্বাস্থ্য ও ডিজিটাল কৃষিতে যৌথ গবেষণা প্রস্তাব জমা দিন।
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-3 divide-x divide-canvas-border rounded-lg border border-canvas-border bg-canvas-card">
            {facts.map((f) => (
              <div key={f.k} className="px-3 py-2.5">
                <dt className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-wider text-pine-600"><f.icon className="size-3" />{f.k}</dt>
                <dd className="mt-0.5 text-[12.5px] font-semibold text-pine-900">{f.v}</dd>
              </div>
            ))}
          </dl>
          {open && (
            <ul className="mt-3 list-inside list-disc space-y-1 font-bangla text-[13.5px] text-pine-900/80">
              <li>প্রধান গবেষক অবশ্যই বাংলাদেশি প্রতিষ্ঠানে কর্মরত হতে হবে</li>
              <li>প্রস্তাবনা সর্বোচ্চ ১০ পৃষ্ঠা, বাংলা বা ইংরেজিতে</li>
              <li>কৃষক-পর্যায়ে মাঠ পরীক্ষার পরিকল্পনা বাধ্যতামূলক</li>
            </ul>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button onClick={onApply} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-4 text-[13.5px] font-semibold text-canvas shadow-tactile-sm shadow-tactile-hover">
              Open Call &amp; Guidelines <ArrowRight className="size-4" />
            </button>
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-10 items-center gap-1 rounded-lg px-3 text-[13px] font-semibold text-pine-900/70 hover:bg-canvas-subtle">
              যোগ্যতা <ChevronDown className={cn('size-4 transition', open && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
