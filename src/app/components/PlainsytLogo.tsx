import { useNavigate } from 'react-router';
import { LOGOS } from '../lib/supabase';
import { cn } from './Primitives';

export function PlainsytMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGOS.icon}
      alt="Plainsyt icon"
      className={cn('shrink-0 rounded-lg border border-pine-900/20 bg-black object-contain', className)}
    />
  );
}

export function PlainsytWordmark({
  lang = 'en',
  className,
}: {
  lang?: 'en' | 'bn';
  className?: string;
}) {
  return (
    <img
      src={lang === 'bn' ? LOGOS.banglaWhite : LOGOS.englishWhite}
      alt={lang === 'bn' ? 'প্লেইনসাইট' : 'Plainsyt'}
      className={cn('h-5 w-auto object-contain select-none', className)}
    />
  );
}

export function PlainsytLogo({
  compact,
  lang = 'en',
  showBothWordmarks = false,
  variant = 'pill',
  onNavigateHome,
  className,
}: {
  compact?: boolean;
  lang?: 'en' | 'bn';
  showBothWordmarks?: boolean;
  variant?: 'pill' | 'on-dark';
  onNavigateHome?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateHome?.();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      className={cn('group inline-flex items-center gap-2 text-pine-900 focus:outline-none', className)}
      aria-label="Plainsyt Home"
    >
      <PlainsytMark className="size-9 shadow-tactile-xs transition group-hover:-translate-y-0.5" />
      {!compact && (
        variant === 'on-dark' ? (
          <span className="inline-flex items-center gap-2">
            <PlainsytWordmark lang={lang} className="h-5 sm:h-6" />
            {showBothWordmarks && (
              <>
                <span className="h-3.5 w-px bg-white/30" />
                <PlainsytWordmark lang={lang === 'en' ? 'bn' : 'en'} className="h-4 opacity-90 sm:h-5" />
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-lg border border-[#04301f] bg-[#04301f] px-2.5 py-1.5 shadow-tactile-xs transition group-hover:bg-[#09472e]">
            <PlainsytWordmark lang={lang} className="h-4 sm:h-[18px]" />
            {showBothWordmarks && (
              <>
                <span className="hidden h-3.5 w-px bg-white/25 sm:inline-block" />
                <PlainsytWordmark lang={lang === 'en' ? 'bn' : 'en'} className="hidden h-3.5 opacity-90 sm:inline-block" />
              </>
            )}
          </span>
        )
      )}
    </a>
  );
}
