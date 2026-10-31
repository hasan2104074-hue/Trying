import type { Article } from '../types';
import { img, PHOTOS } from '../data/mockData';
import { cn } from './Primitives';

const MAP: Record<Article['imageType'], { photo: string; tags: string[]; alt: string }> = {
  drone: { photo: PHOTOS.aerialField, tags: ['NDRE 0.41', 'ALT 30m', 'N −18%'], alt: 'Aerial view of patterned farm fields' },
  lab: { photo: PHOTOS.petri, tags: ['IN VITRO', 'pH 6.4'], alt: 'Researcher working with a petri dish' },
  solar: { photo: PHOTOS.solarGrass, tags: ['4.2 kWp', '8°C · RH 70%', 'LOSS 8%'], alt: 'Solar panels on a green field' },
  floating: { photo: PHOTOS.plantingRice, tags: ['BRRI dhan102', 'Zn 25.5 mg/kg', '148 DAYS'], alt: 'Farmer transplanting rice seedlings in a flooded paddy' },
  biotech: { photo: PHOTOS.labPlants, tags: ['CRISPR', 'T2 LINE'], alt: 'Seedlings in a laboratory' },
  sensor: { photo: PHOTOS.soilHands, tags: ['VWC 32%', 'LoRaWAN'], alt: 'Hands planting a seedling in soil' },
  water: { photo: PHOTOS.greenField, tags: ['AWD', '−26% H₂O'], alt: 'Green rice field under clouds' },
  fisheries: { photo: PHOTOS.boatSunset, tags: ['15 ppt', '৳68k/বিঘা'], alt: 'Boat silhouette on water at sunset' },
};

export function ImageGraphic({ type, className, plate }: { type: Article['imageType']; className?: string; plate?: string }) {
  const m = MAP[type];
  return (
    <div className={cn('relative overflow-hidden bg-pine-800', className)}>
      <img src={img(m.photo, 1200, 700)} alt={m.alt} className="absolute inset-0 size-full object-cover saturate-[0.85]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021a11]/70 via-transparent to-[#021a11]/10" />
      <svg className="absolute inset-0 size-full opacity-25" aria-hidden>
        <defs>
          <pattern id={`g-${type}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#fff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${type})`} />
      </svg>
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {m.tags.map((t) => (
          <span key={t} className="rounded-[4px] border border-white/40 bg-black/35 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white backdrop-blur-sm">
            {t}
          </span>
        ))}
      </div>
      {plate && (
        <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.16em] text-white/80">{plate}</span>
      )}
    </div>
  );
}
