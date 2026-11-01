import { ArrowLeft, CalendarDays, Clock, MapPin, Share2, Ticket, Users, CheckCircle2 } from 'lucide-react';
import type { UpcomingEvent } from '../types';
import { cn } from './Primitives';

interface Props {
  event: UpcomingEvent;
  isRegistered: boolean;
  onBack: () => void;
  onOpenRegister: (event: UpcomingEvent) => void;
  onShare: (title: string) => void;
}

export function EventDetailPage({
  event,
  isRegistered,
  onBack,
  onOpenRegister,
  onShare,
}: Props) {
  return (
    <article className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#061621] bg-canvas-card px-3.5 py-2 font-bangla text-[13px] font-semibold text-[#061621] shadow-tactile-xs hover:bg-canvas-subtle"
        >
          <ArrowLeft className="size-4" /> সকল ইভেন্টে ফিরুন
        </button>
        <button
          type="button"
          onClick={() => onShare(event.title)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-canvas-border bg-canvas-card px-3 py-1.5 text-[12.5px] font-semibold text-pine-900 shadow-sm hover:bg-canvas-subtle"
        >
          <Share2 className="size-4" /> Share Event
        </button>
      </div>

      {/* Main Event Card */}
      <div className="overflow-hidden rounded-2xl border border-[#061621] bg-canvas shadow-tactile-lg">
        {/* Banner with Lime/Pine Gradient */}
        <div className="relative bg-gradient-to-r from-[#061621] via-[#0b2837] to-[#04301f] p-6 text-white sm:p-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="rounded-md bg-[#00ED64] px-2.5 py-1 font-bold text-[#061621]">
              {event.dateMonth} {event.dateDay}, 2026
            </span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-white/90">
              {event.organizerName || 'Plainsyt Agriculture Event'}
            </span>
          </div>

          <h1 className="mt-4 font-bangla text-[26px] font-bold leading-tight text-white sm:text-[34px]">
            {event.title}
          </h1>

          <p className="mt-3 max-w-2xl font-bangla text-[15px] leading-relaxed text-white/80">
            {event.description ||
              'বাংলাদেশের কৃষিবিজ্ঞান, প্রিসিশন প্রযুক্তি ও আধুনিক কৃষি উদ্যোক্তাদের মিলনমেলা।'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-[13px] text-white/90">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-[#00ED64]" /> {event.dateMonth} {event.dateDay}, 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-[#00ED64]" /> সকাল ০৯:৩০ — বিকাল ০৫:০০
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-[#00ED64]" /> {event.location}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11.5px]">
              <Users className="size-4 text-[#00ED64]" /> {event.attendeesCount}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#061621] bg-[#00ED64]/10 p-5">
            <div>
              <p className="font-bangla text-[17px] font-bold text-[#061621]">
                {isRegistered ? 'আপনি এই ইভেন্টে রেজিস্টার্ড আছেন' : 'ইভেন্টে আসন সংখ্যা সীমিত'}
              </p>
              <p className="font-bangla text-[13px] text-pine-900/75">
                {isRegistered
                  ? 'আপনার কনফার্মেশন পাস সংরক্ষিত আছে।'
                  : 'অংশগ্রহণকারী গবেষক, শিক্ষার্থী ও কৃষকদের জন্য সার্টিফিকেট ও কিট প্রদান করা হবে।'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenRegister(event)}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-xl border border-[#061621] px-6 font-bangla text-[15px] font-bold shadow-tactile-xs transition',
                isRegistered
                  ? 'bg-canvas text-[#061621] hover:bg-canvas-subtle'
                  : 'bg-[#00ED64] text-[#061621] hover:opacity-95',
              )}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 className="size-5 text-[#00ED64]" /> রেজিস্ট্রেশন সংরক্ষিত
                </>
              ) : (
                <>
                  <Ticket className="size-5" /> রেজিস্ট্রেশন করুন
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="font-bangla text-[20px] font-bold text-[#061621]">
              ইভেন্টের মূল বিষয়বস্তু ও কর্মসূচি
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-canvas-border bg-canvas-card p-4">
                <span className="font-mono text-[11px] font-bold text-pine-600">SESSION 01</span>
                <p className="mt-1 font-bangla text-[15px] font-semibold text-pine-900">
                  মাঠ প্রদর্শনী ও আধুনিক জাত পরিচিতি
                </p>
                <p className="mt-1 font-bangla text-[13px] text-pine-900/70">
                  জলবায়ু সহনশীল শস্য ও ড্রোন স্প্রে প্রযুক্তির বাস্তব প্রয়োগ।
                </p>
              </div>
              <div className="rounded-xl border border-canvas-border bg-canvas-card p-4">
                <span className="font-mono text-[11px] font-bold text-pine-600">SESSION 02</span>
                <p className="mt-1 font-bangla text-[15px] font-semibold text-pine-900">
                  কৃষি বিজ্ঞানী ও উদ্যোক্তা সংলাপ
                </p>
                <p className="mt-1 font-bangla text-[13px] text-pine-900/70">
                  কৃষি পণ্যের সঠিক মূল্য প্রাপ্তি ও বাজার সংযোগ কর্মশালা।
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-canvas-border bg-canvas-subtle p-5 font-bangla text-[14px] text-pine-900/80 leading-relaxed">
            <p className="font-bold text-pine-950 mb-1">ভেন্যু ও আগমন নির্দেশিকা:</p>
            <p>
              অনুষ্ঠানের নির্ধারিত সময়ের ১৫ মিনিট আগে ভেন্যুর অভ্যর্থনা ডেস্কে উপস্থিত হয়ে আপনার টিকিটের ডিজিটাল বা প্রিন্ট কপি দেখিয়ে এন্ট্রি ব্যাজ সংগ্রহ করুন।
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
