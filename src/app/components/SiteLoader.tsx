import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function SiteLoader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const pathRef3 = useRef<SVGPathElement>(null);
  const pathRef4 = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only run if not already loaded in this session, or run once smoothly
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.65,
            ease: 'power3.inOut',
            onComplete: () => {
              setVisible(false);
              onComplete?.();
            },
          });
        },
      });

      // Worm stroke animation on path contours
      const paths = [pathRef1.current, pathRef2.current, pathRef3.current, pathRef4.current].filter(Boolean);
      paths.forEach((p) => {
        if (p) {
          const len = p.getTotalLength ? p.getTotalLength() : 400;
          gsap.set(p, {
            strokeDasharray: `${len * 0.3} ${len * 0.7}`,
            strokeDashoffset: len,
            opacity: 1,
          });
        }
      });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        stagger: 0.15,
      })
        .to(
          textRef.current,
          {
            fill: '#ffffff',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.4',
        )
        .fromTo(
          subTextRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.3',
        )
        .to({}, { duration: 0.3 }); // hold
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#061621] text-white"
      style={{ touchAction: 'none' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute -inset-10 rounded-full bg-[#00ED64]/15 blur-3xl" />

        <svg
          viewBox="0 0 540 140"
          className="relative h-20 w-auto sm:h-28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Neon Lime Worm Lines */}
          <path
            ref={pathRef1}
            d="M 30 75 Q 80 20, 140 75 T 250 75"
            stroke="#00ED64"
            strokeWidth="4"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_#00ED64]"
          />
          <path
            ref={pathRef2}
            d="M 160 35 L 160 105 Q 160 115, 175 115 L 210 115"
            stroke="#00ED64"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_#00ED64]"
          />
          <path
            ref={pathRef3}
            d="M 230 75 Q 280 25, 340 75 T 440 75"
            stroke="#00ED64"
            strokeWidth="4"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_#00ED64]"
          />
          <path
            ref={pathRef4}
            d="M 40 120 L 500 120"
            stroke="#00ED64"
            strokeWidth="2"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_6px_#00ED64]"
          />

          {/* White Bangla Logo Text with Volte Bangla Typography */}
          <text
            ref={textRef}
            x="270"
            y="92"
            textAnchor="middle"
            fill="#ffffff"
            style={{
              fontFamily: "'Volte Bangla', 'Volte', sans-serif",
              fontSize: '76px',
              fontWeight: 700,
              letterSpacing: '1px',
              opacity: 0.1,
            }}
          >
            প্লেইনসাইট
          </text>
        </svg>

        <p
          ref={subTextRef}
          className="mt-3 font-mono text-[11px] font-semibold tracking-[0.26em] text-[#00ED64] uppercase opacity-0"
        >
          Agri-Tech Platform · Bangladesh
        </p>

        {/* Subtle Lime Progress Bar */}
        <div className="mt-5 h-[2px] w-36 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[reel-progress_1.6s_ease-in-out_infinite] bg-[#00ED64]" />
        </div>
      </div>
    </div>
  );
}
