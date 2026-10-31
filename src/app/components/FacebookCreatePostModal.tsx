import { useRef, useState } from 'react';
import { X, Globe2, ChevronDown, Users, Smile, MapPin, UserPlus, ImagePlus, CalendarClock, Bot, CircleDashed, Lock, ThumbsUp, MessageCircle, Share2, Upload } from 'lucide-react';
import type { CommunityPost } from '../types';
import { CURRENT_USER, img, PHOTOS } from '../data/mockData';
import { Avatar, Modal, cn } from './Primitives';
import { TEXT_THEMES } from './CommunityPostCard';

const PRESETS = [img(PHOTOS.plantingRice, 600, 600), img(PHOTOS.soilHands, 600, 600), img(PHOTOS.greenhouse, 600, 600), img(PHOTOS.cowsUmbrella, 600, 600)];
const EMOJIS = ['🌱', '🌾', '🚜', '🔬', '💡'];
const AUDIENCES = [{ label: 'Public', icon: Globe2 }, { label: 'Friends', icon: Users }, { label: 'Only me', icon: Lock }] as const;
const TAGS = [
  { key: 'people', label: 'People', icon: UserPlus, tone: 'text-[#1b74e4]' },
  { key: 'feeling', label: 'Feeling/activity', icon: Smile, tone: 'text-[#f7b928]' },
  { key: 'location', label: 'Location', icon: MapPin, tone: 'text-[#f5533d]' },
  { key: 'collab', label: 'Collaborator', icon: Users, tone: 'text-[#45bd62]' },
] as const;
const TAG_TEXT: Record<string, string> = { people: '— with Mehedi Hasan', feeling: '— feeling 🌱 hopeful', location: '— at Trishal, Mymensingh', collab: '— with BAU Agri-Robotics Lab' };

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={cn('relative h-6 w-11 shrink-0 rounded-full transition', on ? 'bg-[#2d88ff]' : 'bg-[#4e4f50]')}>
      <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}

export function FacebookCreatePostModal({ open, onClose, onSubmit, videoHint }: { open: boolean; onClose: () => void; onSubmit: (p: CommunityPost) => void; videoHint?: boolean }) {
  const [text, setText] = useState('');
  const [theme, setTheme] = useState(0);
  const [showThemes, setShowThemes] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [aiLabel, setAiLabel] = useState(false);
  const [toStory, setToStory] = useState(false);
  const [aud, setAud] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const Aud = AUDIENCES[aud].icon;

  const reset = () => { setText(''); setTheme(0); setImage(null); setTags([]); setAiLabel(false); setToStory(false); setShowThemes(false); };
  const canPost = text.trim().length > 0 || !!image;
  const themed = theme > 0 && !image && text.length < 140;
  const tagLine = tags.map((t) => TAG_TEXT[t]).join(' ');

  const submit = () => {
    if (!canPost) return;
    onSubmit({
      id: `user-${Date.now()}`,
      author: { name: CURRENT_USER.name, avatar: CURRENT_USER.avatar, role: CURRENT_USER.role },
      timestamp: 'এইমাত্র',
      content: text.trim() + (tagLine ? `\n${tagLine}` : ''),
      images: image ? [image] : undefined,
      textTheme: themed ? TEXT_THEMES[theme] : undefined,
      aiLabel,
      stats: { likes: 0, commentsCount: 0, shares: 0 },
      reactionsSummary: 'Be the first to react',
      comments: [],
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-[980px]" labelledBy="fb-create-title">
      <div className="overflow-hidden rounded-t-2xl bg-[#242526] font-sans text-[#E4E6EB] shadow-[0_12px_28px_rgba(0,0,0,.5)] sm:rounded-xl">
        <div className="relative flex h-[60px] items-center justify-center border-b border-[#3e4042]">
          <h2 id="fb-create-title" className="text-[20px] font-bold">Create post</h2>
          <button onClick={onClose} aria-label="Close" className="absolute right-4 flex size-9 items-center justify-center rounded-full bg-[#3a3b3c] text-[#b0b3b8] hover:bg-[#4e4f50]">
            <X className="size-5" />
          </button>
        </div>
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          {/* Editor */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2.5">
              <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-10" />
              <div>
                <p className="text-[15px] font-semibold">{CURRENT_USER.name}</p>
                <button onClick={() => setAud((a) => (a + 1) % AUDIENCES.length)} className="mt-0.5 flex items-center gap-1 rounded-md bg-[#3a3b3c] px-2 py-0.5 text-[12.5px] font-semibold hover:bg-[#4e4f50]">
                  <Aud className="size-3" />{AUDIENCES[aud].label}<ChevronDown className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => {
                const on = tags.includes(t.key);
                return (
                  <button key={t.key} onClick={() => setTags((s) => (on ? s.filter((x) => x !== t.key) : [...s, t.key]))} aria-pressed={on}
                    className={cn('flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-semibold transition', on ? 'border-[#2d88ff] bg-[#263951] text-[#e4e6eb]' : 'border-[#3e4042] text-[#b0b3b8] hover:bg-[#3a3b3c]')}>
                    <t.icon className={cn('size-4', t.tone)} />{t.label}
                  </button>
                );
              })}
            </div>
            <div className={cn('relative rounded-lg transition', themed && cn(TEXT_THEMES[theme], 'flex min-h-[200px] items-center'))}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={videoHint ? `ভিডিওর ক্যাপশন লিখুন, ${CURRENT_USER.name.split(' ')[0]}…` : `What's on your mind, ${CURRENT_USER.name.split(' ')[0]}?`}
                rows={themed ? 3 : 4}
                className={cn('w-full resize-none bg-transparent font-bangla outline-none placeholder:text-[#b0b3b8]', themed ? 'px-6 text-center text-[24px] font-bold text-white placeholder:text-white/70' : 'text-[19px]')}
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowThemes((s) => !s)} aria-label="Text background" className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#f107a3] via-[#7b2ff7] to-[#2d88ff] text-[14px] font-bold text-white">Aa</button>
              {showThemes && TEXT_THEMES.map((t, i) => (
                <button key={i} onClick={() => setTheme(i)} aria-label={`Theme ${i}`} className={cn('size-7 rounded-md border-2', i === 0 ? 'bg-white' : t, theme === i ? 'border-white' : 'border-transparent')} />
              ))}
              <div className="ml-auto flex gap-0.5">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setText((t) => t + e)} className="flex size-8 items-center justify-center rounded-full text-[18px] hover:bg-[#3a3b3c]">{e}</button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#3e4042] p-2">
              {image ? (
                <div className="relative">
                  <img src={image} alt="Selected" className="max-h-[200px] w-full rounded-md object-cover" />
                  <button onClick={() => setImage(null)} aria-label="Remove image" className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-[#242526] hover:bg-[#3a3b3c]"><X className="size-4" /></button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[#4e4f50] bg-[#2f3031] py-5 hover:bg-[#3a3b3c]">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#4e4f50]">{videoHint ? <Upload className="size-5" /> : <ImagePlus className="size-5" />}</span>
                  <span className="text-[14.5px] font-semibold">{videoHint ? 'Add video' : 'Add photos/videos'}</span>
                  <span className="text-[12px] text-[#b0b3b8]">or drag and drop</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage(URL.createObjectURL(f)); }} />
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {PRESETS.map((s) => (
                  <button key={s} onClick={() => setImage(s)} className={cn('overflow-hidden rounded-md border-2', image === s ? 'border-[#2d88ff]' : 'border-transparent')}>
                    <img src={s} alt="Field photo preset" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#3e4042] px-3 py-1">
              <div className="flex items-center gap-3 py-2">
                <Bot className="size-5 text-[#b0b3b8]" />
                <span className="flex-1"><span className="block text-[14px] font-semibold">Add AI label</span><span className="block text-[12px] text-[#b0b3b8]">Let people know this content was made with AI</span></span>
                <Toggle on={aiLabel} onChange={() => setAiLabel((a) => !a)} label="Add AI label" />
              </div>
              <div className="flex items-center gap-3 border-t border-[#3e4042] py-2">
                <CircleDashed className="size-5 text-[#b0b3b8]" />
                <span className="flex-1"><span className="block text-[14px] font-semibold">Share to story</span><span className="block text-[12px] text-[#b0b3b8]">Visible for 24 hours</span></span>
                <Toggle on={toStory} onChange={() => setToStory((a) => !a)} label="Share to story" />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex h-9 items-center gap-1.5 rounded-md bg-[#3a3b3c] px-3 text-[14px] font-semibold hover:bg-[#4e4f50]"><CalendarClock className="size-4" />Schedule</button>
              <button onClick={submit} disabled={!canPost} className="h-9 flex-1 rounded-md bg-[#2d88ff] text-[15px] font-semibold text-white transition hover:bg-[#1877f2] disabled:cursor-not-allowed disabled:bg-[#505151] disabled:text-[#8a8d91]">Post</button>
            </div>
          </div>

          {/* Live preview */}
          <div className="hidden border-l border-[#3e4042] bg-[#18191a] p-4 lg:block">
            <p className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#b0b3b8]"><span className="size-1.5 animate-pulse rounded-full bg-[#45bd62]" />Live preview</p>
            <div className="overflow-hidden rounded-lg bg-[#242526]">
              <div className="flex items-center gap-2.5 p-3">
                <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-10" />
                <div>
                  <p className="text-[14.5px] font-semibold">{CURRENT_USER.name} <span className="font-normal text-[#b0b3b8]">{tagLine}</span></p>
                  <p className="flex items-center gap-1 text-[12px] text-[#b0b3b8]">Just now · <Aud className="size-3" /></p>
                </div>
              </div>
              {themed && text ? (
                <div className={cn('flex min-h-[220px] items-center justify-center px-6 text-center font-bangla text-[22px] font-bold text-white', TEXT_THEMES[theme])}>{text}</div>
              ) : (
                <p className={cn('whitespace-pre-line px-3 pb-3 font-bangla text-[15px] leading-relaxed', !text && 'italic text-[#8a8d91]')}>{text || 'আপনার লেখা এখানে দেখা যাবে…'}</p>
              )}
              {aiLabel && <p className="mx-3 mb-2 inline-flex items-center gap-1 rounded bg-[#3a3b3c] px-1.5 py-0.5 text-[11px] text-[#b0b3b8]"><Bot className="size-3" />AI info</p>}
              {image && <img src={image} alt="" className="max-h-[300px] w-full object-cover" />}
              <div className="mx-3 mt-1 grid grid-cols-3 border-t border-[#3e4042] py-1 text-[13.5px] font-semibold text-[#b0b3b8]">
                <span className="flex items-center justify-center gap-1.5 py-1.5"><ThumbsUp className="size-4" />Like</span>
                <span className="flex items-center justify-center gap-1.5 py-1.5"><MessageCircle className="size-4" />Comment</span>
                <span className="flex items-center justify-center gap-1.5 py-1.5"><Share2 className="size-4" />Share</span>
              </div>
            </div>
            {toStory && <p className="mt-3 text-[12px] text-[#b0b3b8]">✓ এটি আপনার স্টোরিতেও শেয়ার হবে</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
