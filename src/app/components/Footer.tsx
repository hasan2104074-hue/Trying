import { PlainsytLogo } from './PlainsytLogo';
import { cn } from './Primitives';

export function Footer({ compact, className }: { compact?: boolean; className?: string }) {
  const links = ['About', 'Advertise', 'Careers', 'Privacy', 'Terms', 'Contact'];
  return (
    <footer className={cn('px-2 text-pine-900/55', className)}>
      {!compact && (
        <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start">
          <PlainsytLogo />
        </div>
      )}
      <p className="text-[11.5px] leading-relaxed">
        {links.map((l, i) => (
          <span key={l}>
            <a href="/" className="hover:text-pine-900 hover:underline">
              {l}
            </a>
            {i < links.length - 1 && <span className="mx-1">·</span>}
          </span>
        ))}
      </p>
      <p className="mt-2 font-mono text-[10px] tracking-wide">
        © 2026 Plainsyt Media · Powered by Supabase (fycghkjzodjrqornkton)
      </p>
    </footer>
  );
}
