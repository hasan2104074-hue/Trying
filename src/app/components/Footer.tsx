import React from 'react';
import { PlainsytLogo } from './PlainsytLogo';
import { cn } from './Primitives';

interface FooterProps {
  compact?: boolean;
  className?: string;
}

export function Footer({ compact, className }: FooterProps) {
  if (compact) {
    return (
      <footer className={cn('px-2 py-4 text-slate-500 text-xs', className)}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <a href="/explore" className="hover:text-emerald-600 transition-colors">এক্সপ্লোর</a>
          <span>·</span>
          <a href="/events" className="hover:text-emerald-600 transition-colors">ইভেন্ট</a>
          <span>·</span>
          <a href="/store" className="hover:text-emerald-600 transition-colors">স্টোর</a>
          <span>·</span>
          <a href="/ideas" className="hover:text-emerald-600 transition-colors">আইডিয়া</a>
          <span>·</span>
          <a href="#" className="hover:text-emerald-600 transition-colors">শর্তাবলী</a>
          <span>·</span>
          <a href="#" className="hover:text-emerald-600 transition-colors">গোপনীয়তা</a>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 font-sans">
          © {new Date().getFullYear()} Plainsyt. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </footer>
    );
  }

  return (
    <footer className={cn('mt-16 border-t border-slate-200/80 bg-white/70 backdrop-blur-md text-slate-700', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <PlainsytLogo />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              বাংলা ভাষায় চিন্তাশীল প্রবন্ধ, বিশ্লেষণ ও মতামতের আধুনিক উন্মুক্ত ব্লগিং প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00ED64]/15 text-[#061621] border border-[#00ED64]/40">
                <span className="h-2 w-2 rounded-full bg-[#00ED64] animate-pulse"></span>
                বাংলাদেশি ডিজিটাল প্রকাশনা
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              নেভিগেশন
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" className="hover:text-[#061621] hover:underline underline-offset-4 decoration-[#00ED64] transition-all">
                  ফিড ও নিবন্ধসমূহ
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-[#061621] hover:underline underline-offset-4 decoration-[#00ED64] transition-all">
                  ট্রেন্ডিং ও বিষয়ভিত্তিক অনুসন্ধান
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-[#061621] hover:underline underline-offset-4 decoration-[#00ED64] transition-all">
                  আসন্ন ইভেন্ট ও সেমিনার
                </a>
              </li>
              <li>
                <a href="/store" className="hover:text-[#061621] hover:underline underline-offset-4 decoration-[#00ED64] transition-all">
                  প্লেইনসাইট প্রকাশনী ও মার্চ
                </a>
              </li>
              <li>
                <a href="/ideas" className="hover:text-[#061621] hover:underline underline-offset-4 decoration-[#00ED64] transition-all">
                  পাঠকদের আইডিয়া ও চিন্তা
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              বিভাগসমূহ
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/explore?topic=tech" className="hover:text-[#061621] transition-colors">
                  প্রযুক্তি ও উদ্ভাবন
                </a>
              </li>
              <li>
                <a href="/explore?topic=literature" className="hover:text-[#061621] transition-colors">
                  সাহিত্য ও সংস্কৃতি
                </a>
              </li>
              <li>
                <a href="/explore?topic=science" className="hover:text-[#061621] transition-colors">
                  বিজ্ঞান ও দর্শন
                </a>
              </li>
              <li>
                <a href="/explore?topic=economy" className="hover:text-[#061621] transition-colors">
                  অর্থনীতি ও সমাজ
                </a>
              </li>
              <li>
                <a href="/explore?topic=journalism" className="hover:text-[#061621] transition-colors">
                  অনুসন্ধানী প্রতিবেদন
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              যোগাযোগ ও নীতি
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-[#061621] transition-colors">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#061621] transition-colors">
                  লেখক নির্দেশিকা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#061621] transition-colors">
                  গোপনীয়তা নীতিমালা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#061621] transition-colors">
                  ব্যবহারের শর্তাবলী
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#061621] transition-colors">
                  বিজ্ঞাপন ও পার্টনারশিপ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-sans">
            © {new Date().getFullYear()} Plainsyt Media. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">ঢাকা, বাংলাদেশ</span>
            <span className="h-3 w-px bg-slate-300"></span>
            <span className="font-semibold text-slate-700">স্বচ্ছ ও মুক্ত চিন্তার মঞ্চ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
