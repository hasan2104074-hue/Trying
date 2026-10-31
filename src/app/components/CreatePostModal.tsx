import { useState } from 'react';
import { PenLine, Plus, X } from 'lucide-react';
import type { Article, ArticleCategory } from '../types';
import { Modal, CloseButton, SectionLabel, cn } from './Primitives';
import { CURRENT_USER } from '../data/mockData';

const CATS: { bn: ArticleCategory; en: string; img: Article['imageType'] }[] = [
  { bn: 'শস্য ও কৃষিবিজ্ঞান', en: 'Crops & Agronomy', img: 'floating' },
  { bn: 'এগ্রি-টেক ও ড্রোন', en: 'Agri-Tech & Drones', img: 'drone' },
  { bn: 'গবেষণা সহজ ভাষায়', en: 'Research Explained', img: 'lab' },
  { bn: 'খাদ্য ও কোল্ড চেইন', en: 'Food Cold Chain', img: 'solar' },
  { bn: 'জলবায়ু ও স্থায়িত্ব', en: 'Climate & Salinity', img: 'water' },
  { bn: 'স্টার্টআপ ও উদ্ভাবন', en: 'Startups & IoT', img: 'sensor' },
  { bn: 'মৎস্য ও প্রাণিসম্পদ', en: 'Fisheries & Livestock', img: 'fisheries' },
];

/** "Write Article" — editorial long-form composer */
export function CreatePostModal({ open, onClose, onPublish }: { open: boolean; onClose: () => void; onPublish: (a: Article) => void }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [cat, setCat] = useState(0);
  const [takeaways, setTakeaways] = useState<string[]>(['']);

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const ready = title.trim().length > 8 && body.trim().length > 40;

  const publish = () => {
    if (!ready) return;
    const c = CATS[cat];
    onPublish({
      id: `ua${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || body.trim().slice(0, 120) + '…',
      category: c.bn,
      categoryEn: c.en,
      imageType: c.img,
      author: { name: CURRENT_USER.nameBn, designation: 'কৃষি প্রকৌশলী', organization: 'BAU', avatar: CURRENT_USER.avatar },
      publishedAt: 'আজ',
      readTimeMinutes: Math.max(1, Math.round(words / 180)),
      content: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      takeaways: takeaways.map((t) => t.trim()).filter(Boolean),
      stats: { views: 0, likes: 0, commentsCount: 0, shares: 0 },
      comments: [],
    });
    setTitle(''); setSubtitle(''); setBody(''); setTakeaways(['']);
    onClose();
  };

  const field = 'w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-2 font-bangla text-pine-900 outline-none placeholder:text-pine-900/35 focus:border-pine-900';

  return (
    <Modal open={open} onClose={onClose} className="max-w-[720px]" labelledBy="write-title">
      <div className="rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-pine-900 px-5 py-3.5">
          <h2 id="write-title" className="flex items-center gap-2 font-display text-[22px] font-semibold text-pine-900"><PenLine className="size-5" />নতুন প্রতিবেদন লিখুন</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="space-y-4 p-5">
          <div>
            <SectionLabel className="mb-1.5">বিভাগ · Section</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {CATS.map((c, i) => (
                <button key={c.bn} onClick={() => setCat(i)} aria-pressed={cat === i} className={cn('rounded-full border px-3 py-1 font-bangla text-[12.5px] font-medium transition', cat === i ? 'border-pine-900 bg-pine-900 text-canvas' : 'border-pine-900/25 text-pine-900 hover:border-pine-900')}>{c.bn}</button>
              ))}
            </div>
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="শিরোনাম — স্পষ্ট, তথ্যনির্ভর" className={cn(field, 'border-0 border-b border-pine-900/25 rounded-none bg-transparent px-0 font-display text-[26px] font-bold')} />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="উপশিরোনাম (ঐচ্ছিক)" className={cn(field, 'text-[15px]')} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={7} placeholder={'মূল লেখা… অনুচ্ছেদ আলাদা করতে একটি ফাঁকা লাইন দিন।'} className={cn(field, 'resize-y text-[15.5px] leading-relaxed')} />
          <div>
            <SectionLabel className="mb-1.5">মূল কথা · Takeaways</SectionLabel>
            <div className="space-y-1.5">
              {takeaways.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <span className="mt-2 font-mono text-[11px] text-pine-600">{String(i + 1).padStart(2, '0')}</span>
                  <input value={t} onChange={(e) => setTakeaways((s) => s.map((x, j) => (j === i ? e.target.value : x)))} placeholder="একটি মূল তথ্য…" className={cn(field, 'text-[14px]')} />
                  {takeaways.length > 1 && <button onClick={() => setTakeaways((s) => s.filter((_, j) => j !== i))} aria-label="Remove" className="text-pine-900/50 hover:text-pine-900"><X className="size-4" /></button>}
                </div>
              ))}
              {takeaways.length < 4 && (
                <button onClick={() => setTakeaways((s) => [...s, ''])} className="ml-6 inline-flex items-center gap-1 font-mono text-[11px] text-pine-600 hover:text-pine-900"><Plus className="size-3" />add takeaway</button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-canvas-border px-5 py-3.5">
          <span className="font-mono text-[10.5px] text-pine-600">{words} words · ~{Math.max(1, Math.round(words / 180))} min read</span>
          <button onClick={publish} disabled={!ready} className="h-10 rounded-lg border border-pine-900 bg-pine-900 px-5 text-[14px] font-semibold text-canvas shadow-tactile-sm shadow-tactile-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
            প্রকাশ করুন
          </button>
        </div>
      </div>
    </Modal>
  );
}
